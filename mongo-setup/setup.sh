docker exec -it CHANG_ME_mongo sh ./scripts/rs-init.sh

sleep 1

docker restart CHANGE_ME_api
