FROM node:17-buster

ENV PUBLIC_URL=/tiralabra

WORKDIR /tiralabra

COPY package.json package-lock.json /tiralabra/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /tiralabra

RUN rm -rf ~/.npm

CMD ["npm","run","start:dev"]
