#!/bin/sh
echo "Installing dependencies with yarn"
yarn

echo "Restarting the process"
pm2 restart ecosystem.config.js
