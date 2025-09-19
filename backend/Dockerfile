# Backend Dockerfile should use Node 18
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# First install all dependencies (including dev) to generate proper lock file
RUN npm install
COPY . .

# Then copy the rest of the application
COPY .env ./


EXPOSE 5000

CMD ["npm", "start"]