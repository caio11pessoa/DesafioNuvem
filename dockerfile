FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]