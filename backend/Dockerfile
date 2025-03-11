# Use Node.js base image
FROM --platform=linux/amd64 node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean npm cache
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 5001

# Start the application using the startup script
CMD ["./start.sh"] 