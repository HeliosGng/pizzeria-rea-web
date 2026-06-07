# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets and bundled backend server
COPY --from=build /app/dist ./dist
COPY menu_items.json ./

# Expose port (Cloud Run will inject standard PORT environment variable, usually 8080)
EXPOSE 8080

CMD ["npm", "start"]
