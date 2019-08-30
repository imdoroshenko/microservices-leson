FROM node:12.6.0-alpine as build-stage

RUN apk add --no-cache git python g++ make py-pip

WORKDIR /usr/src/app

COPY . .

RUN npm ci

FROM node:12.6.0-alpine

RUN apk add --no-cache python py-pip

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app .

CMD [ "npm", "start" ]
