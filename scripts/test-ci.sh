#!/bin/bash
set -e # Exit on error

# Set CI environment variables
export CI=true
export NODE_ENV=test

# Clean and install dependencies
rm -rf node_modules
npm ci

# Build the app
npm run build

# Start the server in the background
npm run start &

# Wait for the server to be ready
npx wait-on http://localhost:3000

# Run the tests
npm run test:e2e

# Kill the background server
kill $(lsof -t -i:3000)