#!/bin/sh

# Backup mongo data in docker container
docker exec -it CHANG_ME_mongo sh -c 'mongodump --gzip --archive=$BACKUP_URL/backup.gz --db=$MONGO_INITDB_DATABASE'

# Copy to backup folder
docker cp CHANG_ME_mongo:$BACKUP_URL/backup.gz ./backup/

# Remove the backup in mongo container
docker exec -it CHANG_ME_mongo sh -c 'rm -f $BACKUP_URL/backup.gz'