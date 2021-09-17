#!/bin/sh
echo "Installing dependencies with npm"
npm i

echo "Running the latest migrations"
npx knex migrate:latest --env production

echo "Restarting the process"
pm2 restart ecosystem.config.js
