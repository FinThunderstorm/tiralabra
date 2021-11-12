FROM node:17-buster

ENV PUBLIC_URL=/

WORKDIR /tiralabra

COPY package.json package-lock.json /tiralabra/

RUN npm ci

EXPOSE 3000
EXPOSE 3001

COPY . /tiralabra/

#RUN chown -R 1001:121 "/root/.npm"
#RUN rm -rf /root/.npm
RUN chmod g+rwx /root /root/.npm
RUN echo "$(whoami) / $UID"


CMD ["npm","run","start:dev"]
