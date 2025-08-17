package services

import (
	"errors"
	"testing"

	"mobile-shop-backend/internal/models"
	"mobile-shop-backend/internal/services"
	"mobile-shop-backend/tests/mocks"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func TestAuthService_Register(t *testing.T) {
	testCases := []struct {
		name          string
		input         models.RegisterRequest
		mockSetup     func(*mocks.MockUserRepository)
		expectedError bool
		errorMessage  string
	}{
		{
			name: "Successful registration",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(false, nil)
				mockRepo.On("UsernameExists", "johndoe").Return(false, nil)
				mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(nil).Run(func(args mock.Arguments) {
					user := args.Get(0).(*models.User)
					if user.ID == uuid.Nil {
						user.ID = uuid.New()
					}
				})
			},
			expectedError: false,
		},
		{
			name: "Email already exists",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(true, nil)
			},
			expectedError: true,
			errorMessage:  "email already exists",
		},
		{
			name: "Username already exists",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(false, nil)
				mockRepo.On("UsernameExists", "johndoe").Return(true, nil)
			},
			expectedError: true,
			errorMessage:  "username already exists",
		},
		{
			name: "Database error during email check",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(false, errors.New("database error"))
			},
			expectedError: true,
			errorMessage:  "failed to check email existence",
		},
		{
			name: "Database error during username check",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(false, nil)
				mockRepo.On("UsernameExists", "johndoe").Return(false, errors.New("database error"))
			},
			expectedError: true,
			errorMessage:  "failed to check username existence",
		},
		{
			name: "Database error during user creation",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(false, nil)
				mockRepo.On("UsernameExists", "johndoe").Return(false, nil)
				mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(errors.New("database error"))
			},
			expectedError: true,
			errorMessage:  "failed to create user",
		},
	}

	jwtSecret := []byte("test-secret")

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.mockSetup(mockRepo)

			authService := services.NewAuthService(mockRepo, jwtSecret)
			user, token, err := authService.Register(&tc.input)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
				assert.Nil(t, user)
				assert.Empty(t, token)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.NotEmpty(t, token)
				assert.Equal(t, tc.input.Name, user.Name)
				assert.Equal(t, tc.input.Username, user.Username)
				assert.Equal(t, tc.input.Email, user.Email)
				assert.NotEmpty(t, user.ID)
				assert.NotEmpty(t, user.Password) // Should be hashed
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestAuthService_Login(t *testing.T) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	testUser := &models.User{
		ID:       uuid.New(),
		Name:     "John Doe",
		Username: "johndoe",
		Email:    "john@example.com",
		Password: string(hashedPassword),
	}

	testCases := []struct {
		name          string
		input         models.LoginRequest
		mockSetup     func(*mocks.MockUserRepository)
		expectedError bool
		errorMessage  string
	}{
		{
			name: "Successful login",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "johndoe").Return(testUser, nil)
			},
			expectedError: false,
		},
		{
			name: "User not found",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "johndoe").Return(nil, gorm.ErrRecordNotFound)
			},
			expectedError: true,
			errorMessage:  "invalid credentials",
		},
		{
			name: "Wrong password",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "wrongpassword",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "johndoe").Return(testUser, nil)
			},
			expectedError: true,
			errorMessage:  "invalid credentials",
		},
		{
			name: "Database error during lookup",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "password123",
			},
			mockSetup: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "johndoe").Return(nil, errors.New("database error"))
			},
			expectedError: true,
			errorMessage:  "invalid credentials",
		},
	}

	jwtSecret := []byte("test-secret")

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.mockSetup(mockRepo)

			authService := services.NewAuthService(mockRepo, jwtSecret)
			user, token, err := authService.Login(&tc.input)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
				assert.Nil(t, user)
				assert.Empty(t, token)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.NotEmpty(t, token)
				assert.Equal(t, testUser.ID, user.ID)
				assert.Equal(t, testUser.Name, user.Name)
				assert.Equal(t, testUser.Username, user.Username)
				assert.Equal(t, testUser.Email, user.Email)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
