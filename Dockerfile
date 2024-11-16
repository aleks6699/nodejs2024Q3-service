FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json (или npm-shrinkwrap.json, если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --force && npm cache clean --force

# Копируем остальные файлы
COPY . .

# Открываем порт 4000
EXPOSE 4000

# Запускаем приложение
CMD [ "npm", "star:dev" ]
