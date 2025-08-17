package handlers

import (
	"encoding/json"
	"mobile-shop-backend/internal/models"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct{}

func NewProductHandler() *ProductHandler {
	return &ProductHandler{}
}

type ProductResponse struct {
	Products []models.Product `json:"products"`
	Total    int              `json:"total"`
	Skip     int              `json:"skip"`
	Limit    int              `json:"limit"`
}

func (h *ProductHandler) GetProducts(c *gin.Context) {
	// Get pagination parameters
	limitStr := c.DefaultQuery("limit", "12")
	skipStr := c.DefaultQuery("skip", "0")

	// Get filtering parameters
	search := c.Query("search")
	category := c.Query("category")
	sortBy := c.DefaultQuery("sortBy", "title")
	sortOrder := c.DefaultQuery("sortOrder", "asc")
	priceMin := c.Query("priceMin")
	priceMax := c.Query("priceMax")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 12
	}

	skip, err := strconv.Atoi(skipStr)
	if err != nil || skip < 0 {
		skip = 0
	}

	baseURL := "https://dummyjson.com/products"
	params := url.Values{}

	// Add pagination
	params.Add("limit", strconv.Itoa(limit))
	params.Add("skip", strconv.Itoa(skip))

	// Add sorting
	if sortBy == "price" || sortBy == "title" || sortBy == "rating" {
		params.Add("sortBy", sortBy)
		if sortOrder == "desc" {
			params.Add("order", "desc")
		} else {
			params.Add("order", "asc")
		}
	}

	// Handle different filtering scenarios
	var apiURL string

	if search != "" {
		apiURL = "https://dummyjson.com/products/search?" + params.Encode() + "&q=" + url.QueryEscape(search)
	} else if category != "" {
		apiURL = "https://dummyjson.com/products/category/" + url.QueryEscape(category) + "?" + params.Encode()
	} else {
		apiURL = baseURL + "?" + params.Encode()
	}

	resp, err := http.Get(apiURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer resp.Body.Close()

	var productResponse ProductResponse
	if err := json.NewDecoder(resp.Body).Decode(&productResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse products"})
		return
	}

	if priceMin != "" || priceMax != "" {
		filteredProducts := make([]models.Product, 0)
		for _, product := range productResponse.Products {
			includeProduct := true

			if priceMin != "" {
				if minPrice, err := strconv.ParseFloat(priceMin, 64); err == nil {
					if product.Price < minPrice {
						includeProduct = false
					}
				}
			}

			if priceMax != "" && includeProduct {
				if maxPrice, err := strconv.ParseFloat(priceMax, 64); err == nil {
					if product.Price > maxPrice {
						includeProduct = false
					}
				}
			}

			if includeProduct {
				filteredProducts = append(filteredProducts, product)
			}
		}
		productResponse.Products = filteredProducts
		productResponse.Total = len(filteredProducts)
	}

	c.JSON(http.StatusOK, productResponse)
}

func (h *ProductHandler) GetCategories(c *gin.Context) {
	resp, err := http.Get("https://dummyjson.com/products/category-list")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	defer resp.Body.Close()

	var categories []string
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}
