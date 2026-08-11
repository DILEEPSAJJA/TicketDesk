# ==========================================
# Stage 1: Build React 19 Vite Production SPA
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source files
COPY . .

# Build production bundle (/app/dist)
RUN npm run build

# ==========================================
# Stage 2: Minimal Nginx Production Web Server
# ==========================================
FROM nginx:1.25-alpine AS runner

# Copy custom Nginx configuration for React Router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Configure Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx web server
CMD ["nginx", "-g", "daemon off;"]
