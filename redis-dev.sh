#!/bin/sh

# Start services
docker compose up -d redis

# Give Redis time to initialize
sleep 5

# Run FLUSHALL
docker compose exec redis redis-cli FLUSHALL