package validators

import (
	"testing"

	"mobile-shop-backend/internal/models"
	"mobile-shop-backend/internal/validators"

	"github.com/stretchr/testify/assert"
)

func TestValidateRegistration(t *testing.T) {
	testCases := []struct {
		name          string
		input         models.RegisterRequest
		expectedError bool
		errorMessage  string
	}{
		{
			name: "Valid registration",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: false,
		},
		{
			name: "Missing name",
			input: models.RegisterRequest{
				Name:     "",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "name is required",
		},
		{
			name: "Missing username",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "username is required",
		},
		{
			name: "Missing email",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "email is required",
		},
		{
			name: "Invalid email format",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "invalid-email",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "invalid email",
		},
		{
			name: "Missing password",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "",
			},
			expectedError: true,
			errorMessage:  "password is required",
		},
		{
			name: "Password too short",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "123",
			},
			expectedError: true,
			errorMessage:  "password must be at least 6 characters long",
		},
		{
			name: "Username too short",
			input: models.RegisterRequest{
				Name:     "John Doe",
				Username: "ab",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "username must be at least 3 characters long",
		},
		{
			name: "Name too short",
			input: models.RegisterRequest{
				Name:     "A",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "name must be at least 2 characters long",
		},
		{
			name: "Name too long",
			input: models.RegisterRequest{
				Name:     "ThisIsAVeryLongNameThatExceedsTheMaximumAllowedLength",
				Username: "johndoe",
				Email:    "john@example.com",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "name must be no more than 50 characters long",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			err := validators.ValidateRegisterRequest(&tc.input)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestValidateLogin(t *testing.T) {
	testCases := []struct {
		name          string
		input         models.LoginRequest
		expectedError bool
		errorMessage  string
	}{
		{
			name: "Valid login with username",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "password123",
			},
			expectedError: false,
		},
		{
			name: "Missing username",
			input: models.LoginRequest{
				Username: "",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "username is required",
		},
		{
			name: "Missing password",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "",
			},
			expectedError: true,
			errorMessage:  "password is required",
		},
		{
			name: "Username too short",
			input: models.LoginRequest{
				Username: "ab",
				Password: "password123",
			},
			expectedError: true,
			errorMessage:  "username must be at least 3 characters long",
		},
		{
			name: "Password too short",
			input: models.LoginRequest{
				Username: "johndoe",
				Password: "123",
			},
			expectedError: true,
			errorMessage:  "password must be at least 6 characters long",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			err := validators.ValidateLoginRequest(&tc.input)

			if tc.expectedError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMessage)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
