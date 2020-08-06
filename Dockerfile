FROM node:10.16.0 as builder


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm install

COPY . .

RUN npm run build


FROM  node:10.16.0-alpine

COPY --from=builder /app/dist ./dist

EXPOSE 6000
CMD ["node", "dist/main"]