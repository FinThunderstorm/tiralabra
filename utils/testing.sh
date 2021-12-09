#!/bin/bash

docker-compose up -d

while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:3001/health)" != "200" ]]; 
  do
  echo "Waiting for services to come up for testing... $(curl -s -o /dev/null -w ''%{http_code}'' localhost:3001/health)"
  sleep 30; 
done

docker-compose run --rm app npm run test:coverage

status=$?
docker-compose down -v
exit $status