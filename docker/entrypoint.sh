#!/bin/sh
set -e

# ---- Check required env vars ----
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# ---- Run Prisma migrations ----
echo "🚀 Running database migrations..."
cd /usr/src/app/packages/db
bunx prisma migrate deploy

# ---- Start services ----
echo "🚀 Starting backend and ws-backend..."

# Start main backend
bun /usr/src/app/apps/backend/dist/index.js &

# Start websocket backend
bun /usr/src/app/apps/ws-backend/dist/index.js &

# ---- Keep container alive ----
wait
