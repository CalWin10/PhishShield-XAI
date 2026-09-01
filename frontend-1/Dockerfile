FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 5173 to match docker-compose and vite default (though nginx defaults to 80, we can use a custom conf or just let compose map it if nginx serves on 80. Wait, compose maps 5173:5173. So we should expose 5173 and configure nginx, or change compose. Let's just use a simple Node server or fix compose.)
