.PHONY: help db-backup db-restore up build api-logs api-exec api-restart down down-clear mongo-init unit e2e seed

API_NAME = CHANGE_ME_api
DB_NAME = CHANGE_ME_db
REDIS_NAME = CHANGE_ME_redis


GREEN := \033[0;32m
NC := \033[0m 

help:
	@echo "Available commands:"
	@echo "$(GREEN)  db-backup   $(NC)- Backup the database (Not implemented)"
	@echo "$(GREEN)  db-restore  $(NC)- Restore the database (Not implemented)"
	@echo "$(GREEN)  up          $(NC)- (Docker) Start all services in detached mode"
	@echo "$(GREEN)  build       $(NC)- (Docker) Build and start all services in detached mode"
	@echo "$(GREEN)  api-logs    $(NC)- (Docker) Tail logs for the ${API_NAME} container"
	@echo "$(GREEN)  api-exec    $(NC)- (Docker) Open a shell inside the ${API_NAME} container"
	@echo "$(GREEN)  api-restart $(NC)- (Docker)Restart the ${API_NAME} container"
	@echo "$(GREEN)  down        $(NC)- (Docker)Stop all services"
	@echo "$(GREEN)  down-clear  $(NC)- (Docker for dev) Stop all services and remove volumes"
	@echo "$(GREEN)  mongo-init  $(NC)- Initialize MongoDB using the setup script"
	@echo "$(GREEN)  unit        $(NC)- Run unit tests"
	@echo "$(GREEN)  e2e         $(NC)- Run end-to-end tests"
	@echo "$(GREEN)  seed        $(NC)- Seed the database"



db-backup:
	@echo "Not implemented..."
db-restore:
	@echo "Not implemented..."

up:
	docker compose up -d

build:
	docker compose up -d --build

api-logs:
	docker logs -f ${API_NAME}  --tail 10000

api-exec:
	docker exec -it ${API_NAME} sh

api-restart:
	docker restart ${API_NAME}

down:
	docker compose down

down-clear:
	docker compose down -v

mongo-init:
	sh ./mongo-setup/setup.sh

unit:
	npm run test

e2e:
	npm run test:e2e

seed:
	npm run seed:refresh