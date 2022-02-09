#!/bin/sh
echo "Installing dependencies with yarn"
npm install

echo "Restarting the process"
pm2 restart ecosystem.config.cjs
