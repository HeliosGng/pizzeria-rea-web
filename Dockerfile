# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
# Use npm install to ensure package-lock is updated and verified on the container architecture
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend assets and bundled backend server
COPY --from=build /app/dist ./dist
COPY menu_items.json ./

# Expose port (Cloud Run will inject standard PORT environment variable, usually 8080)
EXPOSE 8080

CMD ["npm", "start"]
