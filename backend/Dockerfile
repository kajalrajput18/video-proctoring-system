FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create uploads directories
RUN mkdir -p uploads/videos

EXPOSE 5000

CMD ["node", "server.js"]