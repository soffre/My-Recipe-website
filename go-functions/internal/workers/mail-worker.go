package workers

import (
	"context"
	"encoding/json"
	utils "go-functions/Utils"
	"go-functions/internal/mail"
	"log"
)

type EmailWorkerProcessor struct {
	mailer *mail.Mailer
}

func NewEmailWorkerProcessor(mailer *mail.Mailer) *EmailWorkerProcessor {
	return &EmailWorkerProcessor{mailer: mailer}
}

func (p *EmailWorkerProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	if t.Type() != utils.TaskEmailDelivery {
		log.Printf("[WORKER ERROR] Unknown task signature: %s", t.Type())
		return nil
	}

	var payload utils.EmailTaskPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		log.Printf("[WORKER ERROR] Failed to parse payload JSON properties: %v", err)
		return nil
	}

	subject, body := utils.GetEmailContentByAction(payload.ActionType, payload.Code)

	err := p.mailer.SendRawEmail(payload.Email, subject, body)
	if err != nil {
		log.Printf("[WORKER RETRY ALERT] Delivery failed to %s. Rescheduling. Error: %v", payload.Email, err)
		return err
	}

	log.Printf("[WORKER SUCCESS] RFC 822 Email safely delivered to %s", payload.Email)
	return nil
}
