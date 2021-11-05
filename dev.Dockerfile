FROM node:17-buster

WORKDIR /tiralabra

RUN adduser tiralabra
USER tiralabra

COPY package.json package-lock.json /tiralabra/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /tiralabra

CMD ["npm","run","start:dev"]
