FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY ./src/ .

ENV DB_HOST=host.docker.internal

EXPOSE 8080

CMD [ "npm", "start" ]