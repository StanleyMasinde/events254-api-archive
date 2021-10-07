#!/bin/sh
echo "Installing dependencies with npm"
npm i

echo "Running the latest migrations"
npm run migrate

echo "Restarting the process"
pm2 restart ecosystem.config.js
