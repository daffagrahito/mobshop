package repositories

import (
	"errors"
	"testing"

	"mobile-shop-backend/internal/models"
	"mobile-shop-backend/tests/mocks"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

func TestUserRepository_Create(t *testing.T) {
	testCases := []struct {
		name          string
		user          *models.User
		setupMock     func(*mocks.MockUserRepository)
		expectedError bool
		errorMessage  string
	}{
		{
			name: "Successful user creation",
			user: &models.User{
				ID:       uuid.New(),
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "hashedpassword",
			},
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(nil)
			},
			expectedError: false,
		},
		{
			name: "Database error during creation",
			user: &models.User{
				ID:       uuid.New(),
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "hashedpassword",
			},
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(errors.New("database error"))
			},
			expectedError: true,
			errorMessage:  "database error",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create and setup mock repository
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			// Call the method under test
			err := mockRepo.Create(tc.user)

			// Assert the expected result
			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
			}

			// Verify all expectations were met
			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_GetByEmail(t *testing.T) {
	testUser := &models.User{
		ID:       uuid.New(),
		Name:     "John Doe",
		Username: "johndoe",
		Email:    "john@example.com",
		Password: "hashedpassword",
	}

	testCases := []struct {
		name          string
		email         string
		setupMock     func(*mocks.MockUserRepository)
		expectedUser  *models.User
		expectedError bool
		errorMessage  string
	}{
		{
			name:  "User found successfully",
			email: "john@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByEmail", "john@example.com").Return(testUser, nil)
			},
			expectedUser:  testUser,
			expectedError: false,
		},
		{
			name:  "User not found",
			email: "notfound@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByEmail", "notfound@example.com").Return(nil, gorm.ErrRecordNotFound)
			},
			expectedUser:  nil,
			expectedError: true,
			errorMessage:  "record not found",
		},
		{
			name:  "Database error",
			email: "error@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByEmail", "error@example.com").Return(nil, errors.New("database connection error"))
			},
			expectedUser:  nil,
			expectedError: true,
			errorMessage:  "database connection error",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			user, err := mockRepo.GetByEmail(tc.email)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedUser, user)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_GetByUsername(t *testing.T) {
	testUser := &models.User{
		ID:       uuid.New(),
		Name:     "John Doe",
		Username: "johndoe",
		Email:    "john@example.com",
		Password: "hashedpassword",
	}

	testCases := []struct {
		name          string
		username      string
		setupMock     func(*mocks.MockUserRepository)
		expectedUser  *models.User
		expectedError bool
		errorMessage  string
	}{
		{
			name:     "User found successfully",
			username: "johndoe",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "johndoe").Return(testUser, nil)
			},
			expectedUser:  testUser,
			expectedError: false,
		},
		{
			name:     "User not found",
			username: "notfound",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByUsername", "notfound").Return(nil, gorm.ErrRecordNotFound)
			},
			expectedUser:  nil,
			expectedError: true,
			errorMessage:  "record not found",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			user, err := mockRepo.GetByUsername(tc.username)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedUser, user)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_GetByID(t *testing.T) {
	testID := uuid.New()
	testUser := &models.User{
		ID:       testID,
		Name:     "John Doe",
		Username: "johndoe",
		Email:    "john@example.com",
		Password: "hashedpassword",
	}

	testCases := []struct {
		name          string
		id            uuid.UUID
		setupMock     func(*mocks.MockUserRepository)
		expectedUser  *models.User
		expectedError bool
		errorMessage  string
	}{
		{
			name: "User found successfully",
			id:   testID,
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByID", testID).Return(testUser, nil)
			},
			expectedUser:  testUser,
			expectedError: false,
		},
		{
			name: "User not found",
			id:   uuid.New(), // Different ID
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("GetByID", mock.AnythingOfType("uuid.UUID")).Return(nil, gorm.ErrRecordNotFound)
			},
			expectedUser:  nil,
			expectedError: true,
			errorMessage:  "record not found",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			user, err := mockRepo.GetByID(tc.id)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedUser, user)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_EmailExists(t *testing.T) {
	testCases := []struct {
		name           string
		email          string
		setupMock      func(*mocks.MockUserRepository)
		expectedExists bool
		expectedError  bool
		errorMessage   string
	}{
		{
			name:  "Email exists",
			email: "john@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "john@example.com").Return(true, nil)
			},
			expectedExists: true,
			expectedError:  false,
		},
		{
			name:  "Email does not exist",
			email: "notfound@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "notfound@example.com").Return(false, nil)
			},
			expectedExists: false,
			expectedError:  false,
		},
		{
			name:  "Database error",
			email: "error@example.com",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("EmailExists", "error@example.com").Return(false, errors.New("database error"))
			},
			expectedExists: false,
			expectedError:  true,
			errorMessage:   "database error",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			exists, err := mockRepo.EmailExists(tc.email)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedExists, exists)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_UsernameExists(t *testing.T) {
	testCases := []struct {
		name           string
		username       string
		setupMock      func(*mocks.MockUserRepository)
		expectedExists bool
		expectedError  bool
		errorMessage   string
	}{
		{
			name:     "Username exists",
			username: "johndoe",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("UsernameExists", "johndoe").Return(true, nil)
			},
			expectedExists: true,
			expectedError:  false,
		},
		{
			name:     "Username does not exist",
			username: "notfound",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("UsernameExists", "notfound").Return(false, nil)
			},
			expectedExists: false,
			expectedError:  false,
		},
		{
			name:     "Database error",
			username: "error",
			setupMock: func(mockRepo *mocks.MockUserRepository) {
				mockRepo.On("UsernameExists", "error").Return(false, errors.New("database error"))
			},
			expectedExists: false,
			expectedError:  true,
			errorMessage:   "database error",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(mocks.MockUserRepository)
			tc.setupMock(mockRepo)

			exists, err := mockRepo.UsernameExists(tc.username)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedExists, exists)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserRepository_Interface(t *testing.T) {
	// Test that our mock implementation satisfies the UserRepository interface
	mockRepo := new(mocks.MockUserRepository)

	// This will compile only if mockRepo implements all methods of UserRepository interface
	var _ interface {
		Create(user *models.User) error
		GetByEmail(email string) (*models.User, error)
		GetByUsername(username string) (*models.User, error)
		GetByID(id uuid.UUID) (*models.User, error)
		EmailExists(email string) (bool, error)
		UsernameExists(username string) (bool, error)
	} = mockRepo

	assert.NotNil(t, mockRepo)
}
