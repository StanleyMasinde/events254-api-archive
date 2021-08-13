#!/bin/sh
echo "Reseting local changes"
git reset --hard

echo "Starting the deployment process"
git pull

echo "Installing dependencies with npm"
npm i

echo "Running the latest migrations"
npx knex migrate:latest --env production

# echo "Building for production"
# npm run build -- -q

echo "Restarting the process"
#pm2 restart all
