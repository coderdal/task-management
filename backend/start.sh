#!/bin/sh

# Run database seed
echo "Running database seed..."
npm run seed

# Start the application
echo "Starting the application..."
node src/index.js 