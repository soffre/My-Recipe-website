package utils

import (
	"context"

	"github.com/cloudinary/cloudinary-go/v2"
)

func credentails() (*cloudinary.Cloudinary, context.Context) {
	cld, _ := cloudinary.New()
	cld.Config.URL.Secure = true
	cxt := context.Background()

	return cld, cxt
}
