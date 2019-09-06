ARG JSS_IMAGE

FROM ${JSS_IMAGE} as app

FROM node:10.11.0-alpine as source

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=app /dist /app/dist/.

FROM node:10.11.0-alpine

WORKDIR /app

COPY --from=source /app /app/.

EXPOSE 3000

ENTRYPOINT npm run start
