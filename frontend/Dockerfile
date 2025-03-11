# Build stage
FROM --platform=linux/amd64 node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean npm cache
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "3066"] 