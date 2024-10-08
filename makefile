.PHONY: help db-backup db-restore up build api-logs api-exec api-restart down down-clear mongo-init unit e2e seed
include .env

API_NAME = CHANGE_ME_api

GREEN := \033[0;32m
NC := \033[0m 

help:
	@echo "Available commands:"
	@echo ""
	@echo "$(GREEN)  db-backup        $(NC) - Backup the database (Not implemented)"
	@echo "$(GREEN)  db-restore       $(NC) - Restore the database (Not implemented)"
	@echo "$(GREEN)  up               $(NC) - (Docker) Start all services in detached mode"
	@echo "$(GREEN)  up-prod          $(NC) - (Docker) Start all services in detached mode for production"
	@echo "$(GREEN)  build-prod       $(NC) - (Docker) Build and start all services in detached mode for production"
	@echo "$(GREEN)  build            $(NC) - (Docker) Build and start all services in detached mode"
	@echo "$(GREEN)  api-logs         $(NC) - (Docker) Tail logs for the ${API_NAME} container"
	@echo "$(GREEN)  api-exec         $(NC) - (Docker) Open a shell inside the ${API_NAME} container"
	@echo "$(GREEN)  api-restart      $(NC) - (Docker) Restart the ${API_NAME} container"
	@echo "$(GREEN)  down             $(NC) - (Docker) Stop all services"
	@echo "$(GREEN)  down-clear       $(NC) - (Docker for dev) Stop all services and remove volumes"
	@echo "$(GREEN)  mongo-init       $(NC) - Initialize MongoDB using the setup script"
	@echo "$(GREEN)  unit-test        $(NC) - Run unit tests"
	@echo "$(GREEN)  e2e-test         $(NC) - Run end-to-end tests"
	@echo "$(GREEN)  architect-test   $(NC) - Run architect testing"
	@echo "$(GREEN)  seed             $(NC) - Seed the database"

db-backup:
	sh ./mongo-setup/backup.sh
	@echo "$(GREEN)==============================="
	@echo "$(GREEN)Database Backup Successully!!"
	@echo "$(GREEN)==============================="

db-restore:
	sh ./mongo-setup/restore.sh
	@echo "$(GREEN)==============================="
	@echo "$(GREEN)Database Restore Successully!!"
	@echo "$(GREEN)==============================="

up:
	docker compose up -d
	
build:
	docker compose up -d --build

up-prod:
	docker compose -f docker-compose.pro.yml up -d
	
build-prod:
	docker compose -f docker-compose.pro.yml up -d --build

down-prod:
	docker compose -f docker-compose.pro.yml down


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

unit-test:
	npm run test

e2e-test:
	npm run test:e2e

architect-test:
	npm run test:architect

seed:
	npm run seed:refresh

ssl: 
	sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/ssl/server.key -out ./nginx/ssl/server.crt