FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install --force && npm cache clean --force

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:init && npm run start"]
