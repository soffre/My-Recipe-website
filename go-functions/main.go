package main

import (
	"go-functions/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	// Set up routes
	routes.SetUpRoutes(router)
	router.Run()
}
