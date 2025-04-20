#!/bin/sh

cd /var/www/html/remmed-api

if [ ! -d "node_modules" ]; then
  echo "node_modules not found, executing npm install..."
  npm install --verbose
else
  echo "node_modules found, skipping npm install"
fi

echo "Initiating app..."
npm run prod
