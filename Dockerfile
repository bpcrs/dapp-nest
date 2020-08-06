FROM node:10.16.0-alpine as builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm run build

COPY . .

FROM  node:10.16.0-alpine

COPY --from=builder /app/dist ./dist

EXPOSE 6000
CMD ["node", "dist/main"]