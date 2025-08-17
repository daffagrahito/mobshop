package database

import (
	"fmt"
	"log"
	"mobile-shop-backend/internal/models"
	"os"
	"strings"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDB() (*gorm.DB, error) {
	dbURL := getEnv("DATABASE_URL", "")

	var dsn string
	if dbURL != "" {
		// Add parameters to prevent prepared statement caching issues
		separator := "?"
		if strings.Contains(dbURL, "?") {
			separator = "&"
		}
		timestamp := fmt.Sprintf("%d", time.Now().UnixNano())
		dsn = dbURL + separator + "prepared_statements=false&statement_cache_mode=disabled&binary_parameters=no&prefer_simple_protocol=true&default_query_exec_mode=simple_protocol&application_name=mobshop_" + timestamp
		log.Println("Using Supabase database connection with prepared statements disabled")
	} else {
		host := getEnv("DB_HOST", "localhost")
		port := getEnv("DB_PORT", "5432")
		user := getEnv("DB_USER", "postgres")
		password := getEnv("DB_PASSWORD", "password")
		dbname := getEnv("DB_NAME", "mobile_shop")
		sslmode := getEnv("DB_SSLMODE", "disable")
		timezone := getEnv("DB_TIMEZONE", "UTC")

		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
			host, user, password, dbname, port, sslmode, timezone)
		log.Println("Using local database connection")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:                                   logger.Default.LogMode(logger.Info),
		PrepareStmt:                              false,
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		return nil, fmt.Errorf("error connecting to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("error getting underlying sql.DB: %v", err)
	}

	sqlDB.SetMaxIdleConns(0) // No idle connections
	sqlDB.SetMaxOpenConns(1) // Only one connection at a time
	sqlDB.SetConnMaxLifetime(time.Second * 10)

	if err := autoMigrate(db); err != nil {
		log.Printf("Warning: Database migration had issues (this is usually fine if tables already exist): %v", err)
	}

	log.Println("Database connected successfully")
	return db, nil
}

func autoMigrate(db *gorm.DB) error {
	if !db.Migrator().HasTable(&models.User{}) {
		if err := db.AutoMigrate(&models.User{}); err != nil {
			return fmt.Errorf("failed to migrate User table: %v", err)
		}
		log.Println("User table created successfully")
	} else {
		log.Println("User table already exists, skipping creation")
	}
	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
