FROM node:17-buster

ENV PUBLIC_URL=/

WORKDIR /tiralabra


COPY package.json package-lock.json ./


RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . .


CMD ["npm","run","start:dev"]


