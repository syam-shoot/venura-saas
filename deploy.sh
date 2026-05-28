#!/bin/bash
# Deploy script untuk Venura SaaS
# Jalankan: ./deploy.sh

set -e

echo "🚀 Deploying Venura..."

cd /var/www/venura

echo "📥 Pulling latest code..."
git pull

echo "🔨 Building containers..."
docker compose up --build -d

echo "⏳ Waiting for containers..."
sleep 8

echo "📦 Copying build assets..."
rm -rf public/build
docker cp venura-app:/var/www/public/build ./public/build

echo "⚡ Caching config..."
docker exec venura-app php artisan config:cache
docker exec venura-app php artisan route:cache
docker exec venura-app php artisan migrate --force 2>/dev/null || true

echo "✅ Deploy selesai!"
echo "🌐 https://venura.web.id"
