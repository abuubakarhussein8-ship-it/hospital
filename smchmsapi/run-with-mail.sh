#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

./mvnw -DskipTests spring-boot:run -Dspring-boot.run.arguments=--server.port=8082
