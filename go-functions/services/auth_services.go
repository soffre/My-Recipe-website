package services

import (
	"context"
	utils "go-functions/Utils"
	"go-functions/internal/mail"
	"go-functions/internal/repository"
	"go-functions/internal/response"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo      *repository.HasuraRepository
	jwtSecret []byte
	codeTTL   time.Duration
}

type UserProfile struct {
	fullName  string
	email     string
	userId    uuid.UUID
	avaterURL string
	roles     []string
}

var DefaultAvatarURL = os.Getenv("DEFAULT_AVATER_URL")

func NewAuthService(repo *repository.HasuraRepository, jwtSecret string, codeTTLStr string) *AuthService {
	duration := 15 * time.Minute

	if codeTTLStr != "" {
		parsed, err := time.ParseDuration(codeTTLStr)
		if err != nil {
			log.Printf("[CONFIG WARNING] Invalid VERIFICATION_CODE_TTL value '%s'. Falling back to 15m. Error: %v", codeTTLStr, err)
		} else {
			duration = parsed
		}
	}
	return &AuthService{
		repo:      repo,
		jwtSecret: []byte(jwtSecret),
		codeTTL:   duration,
	}

}

func (s *AuthService) CreateToken(userId uuid.UUID, email string, roles []string) (string, error) {

	defaultRoles := "user"
	if len(roles) > 0 {
		defaultRoles = roles[0]
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub":      userId.String(),
			"username": email,
			"iss":      "tafach-kitchen-identity",
			"exp":      jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			"https://hasura.io/jwt/claims": map[string]interface{}{
				"x-hasura-allowed-roles": roles,
				"x-hasura-default-role":  defaultRoles,
				"x-hasura-user-id":       userId.String(),
			},
		})

	return jwtToken.SignedString([]byte("a-string-secret-at-least-256-bits-long"))
}

func (s *AuthService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func (s *AuthService) CheckPasswordHash(plainPassword, hashPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashPassword), []byte(plainPassword)) == nil
}

func (s *AuthService) RegisterNewUser(ctx context.Context, email, password, name, avatarURL string) error {

	if !utils.IsValidEmail(email) {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Please input a valid email address."}
	}
	if len(password) < 8 {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Password must consist of 8 or more characters."}
	}

	cleanName := strings.TrimSpace(name)
	if cleanName == "" {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Name is a required field and cannot be left blank."}
	}

	finalAvatarURL := strings.TrimSpace(avatarURL)
	if finalAvatarURL == "" {
		finalAvatarURL = DefaultAvatarURL
	}

	existingUser, err := s.repo.FindUserByEmail(ctx, email)
	if err != nil {
		return err
	}
	if existingUser != nil {
		return &response.AppError{
			HTTPStatus: http.StatusConflict,
			Code:       response.CodeInvalidInput,
			Message:    "An account with this email address already exists."}
	}

	hashedPassword, err := s.HashPassword(password)
	if err != nil {
		return &response.AppError{
			HTTPStatus: http.StatusInternalServerError,
			Code:       response.CodeInternalError,
			Message:    "Encryption processing failed.",
			RawError:   err}
	}

	verifyCode := utils.GenerateRandomString(6)

	err = s.repo.TransactionalSignUp(ctx, email, hashedPassword, cleanName, finalAvatarURL, verifyCode, s.codeTTL, repository.ActionEmailVerification)
	if err != nil {
		return err
	}

	subject := utils.SubjectEmailVerification
	body := utils.GetEmailVerificationTemplate(verifyCode)
	if err = mail.SendEmail(email, subject, body); err != nil {
		return response.NewSMTPMailError("Account registered successfully, but verification email delivery failed.", err)
	}

	return nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {

	if !utils.IsValidEmail(email) {
		return "", &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Please provide a valid email."}
	}

	user, err := s.repo.FindUserByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if user == nil || !s.CheckPasswordHash(password, user.PasswordHash) {
		return "", &response.AppError{
			HTTPStatus: http.StatusUnauthorized,
			Code:       response.CodeAuthFailed,
			Message:    "Invalid email or password credentials."}
	}

	if !user.IsVerified {
		return "", &response.AppError{
			HTTPStatus: http.StatusForbidden,
			Code:       response.CodePermissionDenied,
			Message:    "Please verify your email address before logging in."}
	}

	return s.CreateToken(user.ID, user.Email, user.Roles)
}

func (s *AuthService) InitiatePasswordReset(ctx context.Context, email string) error {

	if err := s.InitiateVerificationSend(ctx, email, string(repository.ActionPasswordReset)); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) CompletePasswordReset(ctx context.Context, email, secretCode, newPassword, confirmpassword string) error {

	if newPassword != confirmpassword {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Password do not match one another.",
		}
	}

	if len(newPassword) < 8 {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Your new password is too short. It must consist of 8 or more characters.",
		}
	}

	if !utils.IsValidEmail(email) {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Please provide a valid email address.",
		}
	}

	verification, err := s.repo.FetchVerificationDataByEmail(ctx, email)
	if err != nil {
		return err
	}

	if verification.Code != secretCode {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "The password reset is failed. Please try again.",
		}
	}

	if time.Now().After(verification.ExpireAt) {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "The password reset token has expired.",
		}
	}

	hashedPassword, err := s.HashPassword(newPassword)
	if err != nil {
		return &response.AppError{
			HTTPStatus: http.StatusInternalServerError,
			Code:       response.CodeInternalError,
			Message:    "Internal server error.",
			RawError:   err,
		}
	}

	if err := s.repo.UpdateUserPassword(ctx, email, hashedPassword); err != nil {
		return err
	}

	if err := s.repo.ArchiveAndPurgeVerificationRow(ctx, email, secretCode, string(repository.ActionPasswordReset), "SUCCESS"); err != nil {
		log.Printf("[WARNING] Audit log processing sequence encountered an interruption: %v", err)
	}

	return nil
}

func (s *AuthService) InitiateVerificationSend(ctx context.Context, email, actionType string) error {

	if !utils.IsValidEmail(email) {
		return &response.AppError{
			HTTPStatus: http.StatusBadRequest,
			Code:       response.CodeInvalidInput,
			Message:    "Please provide a valid email address.",
		}
	}

	userExists, err := s.repo.CheckIfUserExists(ctx, email)

	if err != nil {
		return err
	}

	if !userExists {
		log.Printf("[SECURITY] Verification Code send requested for non-existent email: %s", email)
		return nil
	}

	status, currentData, err := s.repo.CheckVerificationState(ctx, email)
	if err != nil {
		return err
	}

	if status == repository.StatusActiveCode {
		return &response.AppError{
			HTTPStatus: http.StatusTooManyRequests,
			Code:       response.CodeRateLimitExceeded,
			Message:    "Your code is already active. Please wait a moment before asking for another.",
		}
	}

	if status != repository.StatusNoRowExists {
		if err := s.repo.ArchiveAndPurgeVerificationRow(ctx, email, currentData.Code, actionType, "EXPIRED"); err != nil {
			log.Printf("[WARNING] Audit log processing sequence encountered an interruption: %v", err)
		}
	}

	newCode := utils.GenerateRandomString(6)

	err = s.repo.InsertVerificationRow(ctx, email, newCode, s.codeTTL, actionType)
	if err != nil {
		return err
	}

	var subject, body string
	if actionType == string(repository.ActionPasswordReset) {
		subject = utils.SubjectPasswordReset
		body = utils.GetPasswordResetTemplate(newCode)
	} else {
		subject = utils.SubjectEmailVerification
		body = utils.GetEmailVerificationTemplate(newCode)
	}

	err = mail.SendEmail(email, subject, body)
	if err != nil {
		return response.NewSMTPMailError("we could not send your code. Please try again later.", err)
	}

	return nil

}
