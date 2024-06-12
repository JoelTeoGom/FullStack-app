FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY sql/seed.sql /app/sql/seed.sql

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm migration:run -d ./src/data-source.js && npm start"]
