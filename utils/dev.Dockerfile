FROM node:17-buster

ENV PUBLIC_URL=/tiralabra
RUN useradd -ms /bin/bash tiralabra
USER tiralabra
WORKDIR /tiralabra

COPY package.json package-lock.json /tiralabra/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /tiralabra

RUN chown -R 1001:121 "/root/.npm"
RUN rm -rf /root/.npm


CMD ["npm","run","start:dev"]
