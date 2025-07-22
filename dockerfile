# Etapa 1 - build da aplicação
FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src

# Instala dependências
RUN npm install

# Gera os arquivos do Prisma
RUN npx prisma generate

# Copia o restante dos arquivos
COPY . .

# Expõe a porta do servidor
EXPOSE 3000

# Inicia o servidor
CMD ["npm", "start"]
