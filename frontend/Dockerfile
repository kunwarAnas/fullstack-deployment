# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# -------- Production stage --------
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output
COPY --from=builder /app/build /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
