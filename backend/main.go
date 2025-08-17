package main

import (
	"log"
	"mobile-shop-backend/internal/database"
	"mobile-shop-backend/internal/handlers"
	"mobile-shop-backend/internal/middleware"
	"mobile-shop-backend/internal/repositories"
	"mobile-shop-backend/internal/services"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Could not load .env file, using system environment variables")
	}

	r := gin.Default()

	// Configure trusted proxies for security
	trustedProxies := getTrustedProxies()

	if err := r.SetTrustedProxies(trustedProxies); err != nil {
		log.Printf("Warning: Failed to set trusted proxies: %v", err)
	}

	log.Printf("Configured trusted proxies: %v", trustedProxies)

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:5174",
		"http://34.142.218.188",
		"http://34.142.218.188:8080",
		"https://34-142-218-188.sslip.io",
	}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected successfully")
	setupFullRoutes(r, db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}

func setupFullRoutes(r *gin.Engine, db *gorm.DB) {
	jwtSecret := getJWTSecret()

	// Initialize
	userRepo := repositories.NewUserRepository(db)
	authService := services.NewAuthService(userRepo, jwtSecret)
	authHandler := handlers.NewAuthHandler(authService)
	productHandler := handlers.NewProductHandler()

	// Public routes
	api := r.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
		api.POST("/logout", authHandler.Logout)
		api.GET("/products", productHandler.GetProducts)
		api.GET("/categories", productHandler.GetCategories)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware(db))
	{
		protected.GET("/profile", authHandler.GetProfile)
		protected.POST("/checkout", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Coming soon"})
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "mode": "full"})
	})
}

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	return []byte(secret)
}

func getTrustedProxies() []string {
	envProxies := os.Getenv("TRUSTED_PROXIES")
	if envProxies != "" {
		proxies := strings.Split(envProxies, ",")
		for i, proxy := range proxies {
			proxies[i] = strings.TrimSpace(proxy)
		}
		return proxies
	}

	// Default trusted proxies for development and common scenarios
	return []string{
		"127.0.0.1",      // localhost
		"::1",            // localhost IPv6
		"10.0.0.0/8",     // private network
		"172.16.0.0/12",  // private network
		"192.168.0.0/16", // private network
	}
}
