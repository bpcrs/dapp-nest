FROM node:10.16.0 as builder


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 6000
CMD ["node", "main.js"]