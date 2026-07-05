package workers

import (
	"context"
	"encoding/json"
	"log"
)

type EmailWorkerProcessor struct {
	mailer *mail.ProductionMailer
}

func NewEmailWorkerProcessor(mailer *mail.ProductionMailer) *EmailWorkerProcessor {
	return &EmailWorkerProcessor{mailer: mailer}
}

func (p *EmailWorkerProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	if t.Type() != mail.TaskEmailDelivery {
		log.Printf("[WORKER ERROR] Unknown task signature: %s", t.Type())
		return nil
	}

	var payload mail.EmailTaskPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		log.Printf("[WORKER ERROR] Failed to parse payload JSON properties: %v", err)
		return nil
	}

	// 1. Resolve your global HTML templates
	subject, body := mail.GetEmailContentByAction(payload.ActionType, payload.Code)

	// 2. Invoke the zero-dependency RFC 822 socket transmitter
	err := p.mailer.SendRawEmail(payload.Email, subject, body)
	if err != nil {
		// Returning the error triggers Asynq's exponential backoff retry loop automatically!
		log.Printf("[WORKER RETRY ALERT] Delivery failed to %s. Rescheduling. Error: %v", payload.Email, err)
		return err
	}

	log.Printf("[WORKER SUCCESS] RFC 822 Email safely delivered to %s", payload.Email)
	return nil
}
