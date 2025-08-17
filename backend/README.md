# MobileShop Backend

A Go-based REST API server built with Gin framework.

## Prerequisites

- Go 1.19 or higher
- PostgreSQL database

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=8080
   JWT_SECRET=your-jwt-secret-key
   DATABASE_URL=your-database-connection-string
   GIN_MODE=debug
   ```

4. **Run the application**
   ```bash
   go run main.go
   ```

5. **Verify it's running**
   Open your browser and navigate to `http://localhost:8080/health`

The API server will be running on `http://localhost:8080`