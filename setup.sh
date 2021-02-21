#!/bin/sh
# Copyright opensouce254 2021.
# All rights reserverd
# This script will help you setup the application in your server
user=$(whoami)
nodeVersion=$(node -v)
npmVersion=$(npm -v)
echo "Environment details\nCurrent user: ${user}\nNode version: ${nodeVersion}\nnpm version: ${npmVersion}"
echo "Installing dependencies with npm"
npm i
echo "Please answer the following setup questions"
echo "Enter the application port e.g 3000"
read PORT
echo "Your public URL e.g https://events254.com"
read APP_URL
echo "Your database client e.g MySql2"
read DB_CLIENT
echo "Your database host e.g localhost"
read DB_HOST
echo "Your database username"
read DB_USER
echo "Your database password"
read DB_PASSWORD
echo "Enter the schema name e.g events254"
read DB_DATABASE
echo "Next setup your smtp"
echo "Mailhost e.g 127.0.0.1"
read MAIL_HOST
echo "Mail Port e.g 1025"
read MAIL_PORT
echo "Mail user name"
read MAIL_USERNAME
echo "Mail password"
read MAIL_PASSWORD
echo "AWS setup"
echo "AWS access key ID"
read AWS_ACCESS_KEY_ID
echo "AWS secret key"
read AWS_SECRET_ACCESS_KEY
echo "AWS region e.g eu-west-2"
read AWS_S3_REGION
echo "AWS S3 bucket e.g events254"
read AWS_S3_BUCKET

## Write into .env
echo "NODE_ENV=production\n" >> .env
echo "PORT=${PORT}" >> .env
echo "APP_URL=${APP_URL}\n" >> .env
echo "DB_CLIENT=${DB_CLIENT}" >> .env
echo "DB_HOST=${DB_HOST}" >> .env
echo "DB_USER=${DB_USER}" >> .env
echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
echo "DB_DATABASE=${DB_DATABASE}\n" >> .env
echo "MAIL_HOST=${MAIL_HOST}" >> .env
echo "MAIL_PORT=${MAIL_PORT}" >> .env
echo "MAIL_USERNAME=${MAIL_USER}" >> .env
echo "MAIL_PASSWORD=${MAIL_PASSWORD}" >> .env
echo "SECURE=false\n" >> .env
echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> .env
echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}\n" >> .env
echo "AWS_S3_REGION=${AWS_S3_REGION}" >> .env
echo "AWS_S3_BUCKET=${AWS_S3_BUCKET}" >> .env

## run the migrations
echo "Running database migrations ⌗"
npx knex migrate:latest --env production
echo "Linting your code 🧪"
npm run lint
echo "Building for production 🏗"
npm run build
echo "Starting the app in PM2 🕸"
pm2 start ecosystem.config.js
echo "The setup is complete if anything is not correct, run this script again"
