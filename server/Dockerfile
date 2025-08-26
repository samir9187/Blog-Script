FROM node:18

WORKDIR /app

COPY package.json ./
COPY .env ./
COPY ./controllers ./controllers
COPY ./middleware ./middleware
COPY ./models ./models
COPY ./routes ./routes
COPY App.js ./

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]