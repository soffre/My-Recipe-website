package utils

import (
	"encoding/json"
	"go-functions/internal/repository"
)

// TaskEmailDelivery is the unique string identifier for our queue
const TaskEmailDelivery = "email:deliver"

// EmailTaskPayload holds the serializable variables needed by the background worker
type EmailTaskPayload struct {
	Email      string                        `json:"email"`
	Code       string                        `json:"code"`
	ActionType repository.VerificationAction `json:"action_type"`
}

// NewEmailTask packs the parameters into a serializable Asynq Task wrapper object
func NewEmailTask(email, code string, action repository.VerificationAction) (*asynq.Task, error) {
	payload := EmailTaskPayload{
		Email:      email,
		Code:       code,
		ActionType: action,
	}

	bytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TaskEmailDelivery, bytes), nil
}
