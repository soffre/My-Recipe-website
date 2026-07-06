package main

import (
	utils "go-functions/Utils"
	"go-functions/internal/mail"
	"go-functions/workers"
	"log"
	"os"

	"github.com/hibiken/asynq"
)

func main() {
	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	mailer, err := mail.NewMailer()
	if err != nil {
		log.Fatalf("Fatal: Worker failed to validate production SMTP profiles: %v", err)
	}

	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: redisAddr},
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
			},
		},
	)

	processor := workers.NewEmailWorkerProcessor(mailer)
	mux := asynq.NewServeMux()
	mux.HandleFunc(utils.TaskEmailDelivery, processor.ProcessTask)
	log.Printf("[STARTUP] Tafach Kitchen Async Worker active. Monitoring queue...")
	if err := srv.Run(mux); err != nil {
		log.Fatalf("Fatal: Worker container runtime closure error: %v", err)
	}
}
