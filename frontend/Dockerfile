# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Accept build arguments
ARG VITE_RPC_URL
ARG VITE_TOKEN_ADDRESS
ARG VITE_FAUCET_ADDRESS
ARG VITE_CHAIN_ID

# Set environment variables for Vite build
ENV VITE_RPC_URL=${VITE_RPC_URL}
ENV VITE_TOKEN_ADDRESS=${VITE_TOKEN_ADDRESS}
ENV VITE_FAUCET_ADDRESS=${VITE_FAUCET_ADDRESS}
ENV VITE_CHAIN_ID=${VITE_CHAIN_ID}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
