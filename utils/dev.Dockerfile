FROM node:17-buster

ENV PUBLIC_URL=/



RUN echo $(whoami)

WORKDIR /home/node/tiralabra/


COPY package.json package-lock.json /home/node/tiralabra/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /home/node/tiralabra/

CMD ["npm","run","start:dev"]

USER node
