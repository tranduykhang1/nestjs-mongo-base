#!/bin/bash

sleep 5

mongosh <<EOF
use admin

db.createUser({
  user: '${MONGO_INITDB_ROOT_USERNAME}',
  pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
  roles: [{ role: "dbOwner", db: '${MONGO_INITDB_DATABASE}' }]
});

// Authenticate the root user
db.auth('${MONGO_INITDB_ROOT_USERNAME}', '${MONGO_INITDB_ROOT_PASSWORD}');

// Initialize the replica set
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: '${MONGO_HOST}:27017', priority: 2 },
    { _id: 1, host: '${MONGO_HOST_1}:27017', priority: 1 }
  ]
});
EOF

if [ $? -eq 0 ]; then
  echo "MongoDB initialization and replica set configuration completed successfully."
else
  echo "MongoDB initialization or replica set configuration failed."
  exit 1
fi
