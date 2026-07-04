FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://package-mirror.liara.ir/repository/npm/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run typeorm:run && npm start"]