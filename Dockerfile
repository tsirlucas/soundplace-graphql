FROM node:8.11.3-alpine

WORKDIR app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004

CMD npm start
