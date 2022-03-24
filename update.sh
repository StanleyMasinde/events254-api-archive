#!/bin/sh
echo "Installing dependencies with npm"
npm install

echo "Restarting the process"
pm2 restart ecosystem.config.cjs
