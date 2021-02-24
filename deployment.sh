#!/bin/sh
echo "Reseting local changes"
git reset --hard

echo "Starting the deployment process"
git pull

echo "Installing dependencies with npm"
npm i

echo "Rolling back migrations because we are still in dev" # TODO disbale this in prod
npx knex migrate:rollback --env production

echo "Running the latest migrations"
npx knex migrate:latest --env production

echo "Seeding the database" # TODO disble this in prod
npx knex seed:run --env production

echo "Building for production"
npm run build -q

echo "Please remember to restart your PM2"
# pm2 restart ecosystem.config.js
