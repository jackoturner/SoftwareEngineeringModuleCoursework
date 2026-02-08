# Multi-arch official Node image (supports both AMD64 and ARM64)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 3000

CMD ["node", "src/app.js"]
