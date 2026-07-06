package actions

import (
	"go-functions/internal/repository"
	"go-functions/services"
	"os"
	"strings"
)

var (
	HasuraRepo   = repository.NewHasuraRepository()
	queueService = services.NewQueueService(os.Getenv("REDIS_URL"))
	authService  = services.NewAuthService(
		HasuraRepo,
		queueService,
		strings.Trim(os.Getenv("JWT_SECRET_KEY"), "\" "),
		os.Getenv("VERIFICATION_CODE_TTL"), // e.g., "15m" or "1h"
	)
	verifyService     = services.NewVerificationService(HasuraRepo)
	cloudinaryService = services.NewCloudinaryService()
)
