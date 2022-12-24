FROM node:18

WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install
COPY . .

USER root
CMD node index.js