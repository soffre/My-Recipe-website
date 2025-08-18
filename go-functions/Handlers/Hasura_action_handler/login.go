package hasuraactionhandler

import (
	"fmt"

	"github.com/gin-gonic/gin"
	// "github.com/hasura/go-graphql-client"
	// "os"
)

type ActionPayload struct {
	SessionVariables map[string]interface{} `json:"session_variables"`
	Input            map[string]interface{} `json:"input"`
}

func LoginHandler(c *gin.Context) {
	var actionPayload ActionPayload

	if err := c.ShouldBindJSON(&actionPayload); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}

	// Extract session variables and input
	// sessionVariables := actionPayload.SessionVariables
	// input := actionPayload.Input
	// credintails, ok := input["credentails"].(map[string]interface{})
	// if !ok {
	// 	c.JSON(400, gin.H{"error": "Invalid credentials format"})
	// 	return
	// }

	// fmt.Println(credintails)
	// fmt.Println(sessionVariables)
	eventSecret := c.GetHeader("X-Hasura-Event-Secret")
	fmt.Println(actionPayload)
	fmt.Println("Event Secret:", eventSecret)
	// email, ok := credintails["email"].(string)
	// if !ok {
	// 	c.JSON(400, gin.H{"error": "Email is required"})
	// 	return
	// }

	// fmt.Println(email)
	c.JSON(200, gin.H{
		"accessToken": "wer",
	})

}
