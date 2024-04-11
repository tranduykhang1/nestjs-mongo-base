API_NAME = CHANGE_ME_api
DB_NAME = CHANGE_ME_db
REDIS_NAME = CHANGE_ME_redis


docker-up:
	docker compose up -d

docker-build:
	docker compose up -d --build

docker-api-logs:
	docker logs -f ${API_NAME}  --tail 10000

docker-api-exec:
	docker exec -it ${API_NAME} sh

docker-down:
	docker compose down

docker-down-clear:
	docker compose down -v


unit-test:
	npm run test

e2e-test:
	npm run test:e2e

seed:
	npm run seed:refresh