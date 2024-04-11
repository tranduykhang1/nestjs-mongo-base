docker-up:
	docker compose up -d

docker-build:
	docker compose up -d --build

docker-api-logs:
	docker logs -f CHANGE_ME_api  --tail 10000

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