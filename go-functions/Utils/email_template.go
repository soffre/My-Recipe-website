package utils

import (
	"fmt"
	"go-functions/internal/repository"
)

const (
	SubjectPasswordReset     = "Password reset code"
	SubjectEmailVerification = "Verify your email address"
)

func GetEmailContentByAction(action repository.VerificationAction, code string) (string, string) {
	switch action {

	case repository.ActionEmailVerification:
		subject := SubjectEmailVerification
		body := "<h2>Welcome to Tafach Kitchen!</h2>"
		body += "<p>Thank you for signing up. Please verify your email address to activate your account.</p>"
		body += "<p>Your email verification code:</p>"
		body += fmt.Sprintf("<h3 style='color: #2ECC71; font-size: 24px;'>%s</h3>", code)
		body += "<p>This code is valid for 15 minutes.</p>"
		body += "<p>Happy Cooking,<br/>The Tafach Kitchen Team</p>"
		return subject, body

	case repository.ActionPasswordReset:
		subject := SubjectPasswordReset
		body := "<p>You need to insert this code in order to keep resetting your password.</p>"
		body += "<p>Your password reset code:</p>"
		body += fmt.Sprintf("<h3 style='color: #FF5733; font-size: 24px;'>%s</h3>", code)
		body += "<p>If you did not request this, please ignore this email.</p>"
		body += "<p>Thanks,<br/>The Tafach Kitchen Team</p>"
		return subject, body

	default:
		return "Notification Updates", "<p>You have a new safety notification update on your account.</p>"
	}
}
