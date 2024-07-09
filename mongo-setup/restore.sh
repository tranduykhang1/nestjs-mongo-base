# Restore the backup file in mongo container
docker cp ./backup/backup.gz CHANG_ME_mongo:$BACKUP_URL/backup.gz

# Restore the backup in mongo container
docker exec -it CHANG_ME_mongo sh -c 'mongorestore --gzip --archive=$BACKUP_URL/backup.gz --db=$MONGO_INITDB_DATABASE --drop'
