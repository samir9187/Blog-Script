FROM node:18

WORKDIR /app

COPY package.json ./
COPY .env ./
COPY ./public ./public
COPY ./src ./src

RUN npm install
RUN npm run build

EXPOSE 3000

# Serve build with a simple static server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]