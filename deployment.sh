echo "Starting the deployment process"
git pull

echo "Installing dependencies with npm"
npm i

echo "Running the latest migrations"
npx knex migrate:latest --env production

echo "Building for production"
npm run build

echo "Please remember to restart your PM2 process I will restart all for now"
# pm2 restart ecosystem.config.js
