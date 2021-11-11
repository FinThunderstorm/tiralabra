FROM node:17-buster

ENV PUBLIC_URL=/
RUN useradd -ms /bin/bash tiralabra
USER tiralabra
WORKDIR /home/tiralabra/app

COPY package.json package-lock.json /home/tiralabra/app/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /home/tiralabra/app/

#RUN chown -R 1001:121 "/root/.npm"
#RUN rm -rf /root/.npm


CMD ["npm","run","start:dev"]
