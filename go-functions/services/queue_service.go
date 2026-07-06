package services

import (
	"context"
	utils "go-functions/Utils"
	"go-functions/internal/repository"
	"time"

	"github.com/hibiken/asynq"
)

type QueueService struct {
	client *asynq.Client
}

func NewQueueService(redisAddr string) *QueueService {
	return &QueueService{
		client: asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr}),
	}
}

func (q *QueueService) Close() error {
	return q.client.Close()
}

func (q *QueueService) EnqueueEmail(ctx context.Context, email, code string, action repository.VerificationAction) error {
	task, err := utils.NewEmailTask(email, code, action)
	if err != nil {
		return err
	}

	_, err = q.client.EnqueueContext(ctx, task,
		asynq.MaxRetry(5),
		asynq.Timeout(30*time.Second),
		asynq.Retention(24*time.Hour),
	)

	return err
}
