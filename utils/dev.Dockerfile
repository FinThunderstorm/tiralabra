FROM node:17-buster

ENV PUBLIC_URL=/

RUN mkdir /tiralabra && chown node:node /tiralabra
USER node

WORKDIR /tiralabra


COPY package.json package-lock.json ./


RUN npm ci --include=dev

EXPOSE 3000
EXPOSE 3001

COPY . .

CMD ["npm","run","start:dev"]


