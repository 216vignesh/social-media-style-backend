# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
# This should include your tsconfig.json, src folder, etc.
COPY . .

# Run the build script (e.g., to transpile TypeScript to JavaScript into ./dist)
# Ensure 'npm run build' is defined in your package.json scripts
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /app

# Copy package files again for installing only production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy the built application (the 'dist' folder) from the builder stage
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]
