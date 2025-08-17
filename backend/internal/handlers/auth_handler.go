package handlers

import (
	"mobile-shop-backend/internal/models"
	"mobile-shop-backend/internal/services"
	"mobile-shop-backend/internal/utils"
	"mobile-shop-backend/internal/validators"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondWithValidationError(c, err)
		return
	}

	// Additional custom validation
	if err := validators.ValidateRegisterRequest(&req); err != nil {
		utils.RespondWithErrorAndCode(c, http.StatusBadRequest, err.Error(), "VALIDATION_ERROR")
		return
	}

	user, token, err := h.authService.Register(&req)
	if err != nil {
		switch err.Error() {
		case "email already exists":
			utils.RespondWithErrorAndCode(c, http.StatusConflict, "An account with this email already exists", "EMAIL_EXISTS")
		case "username already exists":
			utils.RespondWithErrorAndCode(c, http.StatusConflict, "This username is already taken", "USERNAME_EXISTS")
		default:
			utils.RespondWithError(c, http.StatusInternalServerError, "Failed to create account")
		}
		return
	}

	utils.RespondWithSuccess(c, http.StatusCreated, "Account created successfully", gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"name":     user.Name,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondWithValidationError(c, err)
		return
	}

	// Additional custom validation
	if err := validators.ValidateLoginRequest(&req); err != nil {
		utils.RespondWithErrorAndCode(c, http.StatusBadRequest, err.Error(), "VALIDATION_ERROR")
		return
	}

	user, token, err := h.authService.Login(&req)
	if err != nil {
		switch err.Error() {
		case "invalid credentials":
			utils.RespondWithErrorAndCode(c, http.StatusUnauthorized, "Invalid username or password", "INVALID_CREDENTIALS")
		default:
			utils.RespondWithError(c, http.StatusInternalServerError, "Login failed")
		}
		return
	}

	utils.RespondWithSuccess(c, http.StatusOK, "Login successful", gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"name":     user.Name,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	utils.RespondWithSuccess(c, http.StatusOK, "Logout successful", nil)
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.RespondWithErrorAndCode(c, http.StatusUnauthorized, "User not authenticated", "NOT_AUTHENTICATED")
		return
	}

	user, err := h.authService.GetUserByID(userID.(string))
	if err != nil {
		switch err.Error() {
		case "invalid user ID":
			utils.RespondWithErrorAndCode(c, http.StatusBadRequest, "Invalid user ID", "INVALID_USER_ID")
		case "user not found":
			utils.RespondWithErrorAndCode(c, http.StatusNotFound, "User not found", "USER_NOT_FOUND")
		default:
			utils.RespondWithError(c, http.StatusInternalServerError, "Failed to retrieve profile")
		}
		return
	}

	utils.RespondWithSuccess(c, http.StatusOK, "Profile retrieved successfully", gin.H{
		"user": gin.H{
			"id":         user.ID,
			"name":       user.Name,
			"username":   user.Username,
			"email":      user.Email,
			"created_at": user.CreatedAt,
		},
	})
}
