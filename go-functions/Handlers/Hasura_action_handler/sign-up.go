package hasuraactionhandler

import "github.com/gin-gonic/gin"

// type ActionPayload struct {
// 	SessionVariables map[string]interface{} `json:"session_variables"`
// 	Input            map[string]interface{} `json:"input"`
// }

type GraphQLError struct {
	Message string `json:"message"`
}

func SignUpHandler(c *gin.Context) {

}
