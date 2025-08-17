package services

import (
	"errors"
	"mobile-shop-backend/internal/models"
	"mobile-shop-backend/internal/repositories"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  repositories.UserRepository
	jwtSecret []byte
}

func NewAuthService(userRepo repositories.UserRepository, jwtSecret []byte) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) Register(req *models.RegisterRequest) (*models.User, string, error) {
	// Check if email already exists
	emailExists, err := s.userRepo.EmailExists(req.Email)
	if err != nil {
		return nil, "", errors.New("failed to check email existence")
	}
	if emailExists {
		return nil, "", errors.New("email already exists")
	}

	// Check if username already exists
	usernameExists, err := s.userRepo.UsernameExists(req.Username)
	if err != nil {
		return nil, "", errors.New("failed to check username existence")
	}
	if usernameExists {
		return nil, "", errors.New("username already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Name:     req.Name,
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, "", errors.New("failed to create user")
	}

	token, err := s.generateJWT(user.ID.String())
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return user, token, nil
}

func (s *AuthService) Login(req *models.LoginRequest) (*models.User, string, error) {
	user, err := s.userRepo.GetByUsername(req.Username)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := s.generateJWT(user.ID.String())
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return user, token, nil
}

func (s *AuthService) GetUserByID(userID string) (*models.User, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	user, err := s.userRepo.GetByID(userUUID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	return user, nil
}

func (s *AuthService) generateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // 24 hours
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}
