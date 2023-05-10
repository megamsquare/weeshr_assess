FROM node:18

WORKDIR /app

ENV CGO_ENABLED=0
ENV GOOS=linux

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]