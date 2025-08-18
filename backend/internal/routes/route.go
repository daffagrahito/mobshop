package routes

import (
    "mobile-shop-backend/internal/handlers"
    "mobile-shop-backend/internal/middleware"
    "mobile-shop-backend/internal/repositories"
    "mobile-shop-backend/internal/services"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
    jwtSecret := getJWTSecret()

    // Initialize
    userRepo := repositories.NewUserRepository(db)
    authService := services.NewAuthService(userRepo, jwtSecret)
    authHandler := handlers.NewAuthHandler(authService)
    productHandler := handlers.NewProductHandler()

    // Setup route groups
    setupPublicRoutes(r, authHandler, productHandler)
    setupProtectedRoutes(r, db, authHandler)
    setupHealthRoute(r)
}

func setupPublicRoutes(r *gin.Engine, authHandler *handlers.AuthHandler, productHandler *handlers.ProductHandler) {
    api := r.Group("/api")
    {
        api.POST("/register", authHandler.Register)
        api.POST("/login", authHandler.Login)
        api.POST("/logout", authHandler.Logout)
        api.GET("/products", productHandler.GetProducts)
        api.GET("/categories", productHandler.GetCategories)
    }
}

func setupProtectedRoutes(r *gin.Engine, db *gorm.DB, authHandler *handlers.AuthHandler) {
    api := r.Group("/api")
    protected := api.Group("/")
    protected.Use(middleware.AuthMiddleware(db))
    {
        protected.GET("/profile", authHandler.GetProfile)
        protected.POST("/checkout", func(c *gin.Context) {
            c.JSON(http.StatusOK, gin.H{"message": "Coming soon"})
        })
    }
}

func setupHealthRoute(r *gin.Engine) {
    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "ok", "mode": "full"})
    })
}

func getJWTSecret() []byte {
    secret := os.Getenv("JWT_SECRET")
    return []byte(secret)
}