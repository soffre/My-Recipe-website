package mail

import (
	"errors"
	"fmt"
	"net/smtp"
	"os"
)

type Mailer struct {
	auth        smtp.Auth
	smtpHost    string
	smtpPort    string
	senderEmail string
}

func NewMailer() (*Mailer, error) {
	sender := os.Getenv("SMTP_SENDER")
	host := os.Getenv("SMTP_HOST")
	password := os.Getenv("SMTP_PASSWORD")
	portStr := os.Getenv("SMTP_PORT")

	if sender == "" || host == "" || password == "" || portStr == "" {
		return nil, errors.New("missing critical production SMTP environment keys")
	}

	// Initialize standard PLAIN authorization credentials
	auth := smtp.PlainAuth("", sender, password, host)

	return &Mailer{
		auth:        auth,
		smtpHost:    host,
		smtpPort:    portStr,
		senderEmail: sender,
	}, nil
}

// SendRawEmail compiles and fires standard RFC 822 compliant email byte arrays
func (m *Mailer) SendRawEmail(toEmail, subject, body string) error {
	serverAddress := m.smtpHost + ":" + m.smtpPort

	// 🌟 THE STRICT RFC 822 / RFC 5322 SPECIFICATION FORMAT
	// Every line must terminate with exactly \r\n (Carriage Return + Line Feed)
	message := []byte(fmt.Sprintf(
		"To: %s\r\n"+
			"From: %s\r\n"+
			"Subject: %s\r\n"+
			"MIME-Version: 1.0\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"<html><body>%s</body></html>\r\n",
		toEmail, m.senderEmail, subject, body,
	))

	// Direct socket delivery using Go's built-in standard library
	return smtp.SendMail(
		serverAddress,
		m.auth,
		m.senderEmail,
		[]string{toEmail},
		message,
	)
}
