package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CreateToken(name string, email string, userId uuid.UUID, avaterURL string) (string, error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"fullName":  name,
			"email":     email,
			"userId":    userId,
			"avaterURL": avaterURL,
			"https://hasura.io/jwt/claims": map[string]interface{}{
				"x-hasura-allowed-roles": []string{"user"},
				"x-hasura-default-role":  "user",
				"x-hasura-user-id":       userId.String(),
			},
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		})
	tokenString, err := jwtToken.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
