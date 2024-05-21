API_NAME = CHANGE_ME_api
DB_NAME = CHANGE_ME_db
REDIS_NAME = CHANGE_ME_redis


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

unit-test:
	npm run test

e2e-test:
	npm run test:e2e

seed:
	npm run seed:refresh