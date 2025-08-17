package validators

import (
	"errors"
	"mobile-shop-backend/internal/models"
	"regexp"
	"strings"
)

func ValidateRegisterRequest(req *models.RegisterRequest) error {
	if err := validateName(req.Name); err != nil {
		return err
	}

	if err := validateUsername(req.Username); err != nil {
		return err
	}

	if err := validateEmail(req.Email); err != nil {
		return err
	}

	if err := validatePassword(req.Password); err != nil {
		return err
	}

	return nil
}

func ValidateLoginRequest(req *models.LoginRequest) error {
	if strings.TrimSpace(req.Username) == "" {
		return errors.New("username is required")
	}

	if strings.TrimSpace(req.Password) == "" {
		return errors.New("password is required")
	}

	if len(req.Username) < 3 {
		return errors.New("username must be at least 3 characters long")
	}

	if len(req.Password) < 6 {
		return errors.New("password must be at least 6 characters long")
	}

	return nil
}

func validateName(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return errors.New("name is required")
	}
	if len(name) < 2 {
		return errors.New("name must be at least 2 characters long")
	}
	if len(name) > 50 {
		return errors.New("name must be no more than 50 characters long")
	}

	return nil
}

func validateUsername(username string) error {
	username = strings.TrimSpace(username)
	if username == "" {
		return errors.New("username is required")
	}
	if len(username) < 3 {
		return errors.New("username must be at least 3 characters long")
	}
	if len(username) > 30 {
		return errors.New("username must be no more than 30 characters long")
	}

	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !usernameRegex.MatchString(username) {
		return errors.New("username can only contain letters, numbers, and underscores")
	}

	return nil
}

func validateEmail(email string) error {
	email = strings.TrimSpace(email)
	if email == "" {
		return errors.New("email is required")
	}

	emailRegex := regexp.MustCompile(`^\S+@\S+$`)
	if !emailRegex.MatchString(email) {
		return errors.New("invalid email")
	}

	if len(email) > 100 {
		return errors.New("email must be no more than 100 characters long")
	}

	return nil
}

func validatePassword(password string) error {
	if password == "" {
		return errors.New("password is required")
	}

	if len(password) < 6 {
		return errors.New("password must be at least 6 characters long")
	}

	if len(password) > 100 {
		return errors.New("password must be no more than 100 characters long")
	}

	return nil
}
