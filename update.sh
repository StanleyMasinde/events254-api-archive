#!/bin/sh
echo "Installing dependencies with yarn"
yarn

echo "Running the latest migrations"
npm run migrate

echo "Restarting the process"
pm2 restart ecosystem.config.js
