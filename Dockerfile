FROM node:10.16.0-alpine as development

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

FROM  node:10.16.0-alpine

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 6000
CMD ["node", "dist/main"]