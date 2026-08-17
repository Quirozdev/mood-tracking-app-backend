FROM node:24

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start:dev"]