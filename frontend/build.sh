#!/usr/bin/env bash
# exit on error
set -o errexit

# Copy production environment file
cp .env.production .env

# Install dependencies
npm install

# Build the application
npm run build 