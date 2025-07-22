
````md
# Desafio Técnico - Backend com Node.js, PostgreSQL e IA

Este projeto consiste em uma API RESTful desenvolvida para ingestão de arquivos, registro e consulta de dados estruturados, com autenticação JWT e integração com modelo de linguagem natural para simular respostas baseadas em dados.

---

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **Prisma ORM** + **PostgreSQL**
- **JWT** (Autenticação)
- **Multer** (Upload de arquivos)
- **Hugging Face Transformers** (`@xenova/transformers`)
- **Swagger Autogen** (Documentação automática)
- **Docker + Docker Compose**

---

## 🛠Requisitos

- Docker e Docker Compose instalados

---

## Instalação e Execução

1. **Clone o repositório**

```bash
git clone git@github.com:caio11pessoa/DesafioNuvem.git
cd DesafioNuvem
````

2. **Crie o arquivo `.env`**

```env
DATABASE_URL=postgres://admin:admin@localhost:5432/desafio_db
PORT=3000
```

3. **Suba os containers**

```bash
docker-compose up --build
```

4. **Acesse:**

* API: [http://localhost:3000](http://localhost:3000)
* Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Testando a API com Swagger

Acesse `http://localhost:3000/docs` e use os endpoints disponíveis. Algumas rotas exigem autenticação via token JWT no header:

```
Authorization: Bearer <seu_token_aqui>
```

---

## Estrutura do Projeto

```
📁 src/
│  ├── controllers/
│  ├── middlewares/
│  ├── routes/
│  ├── app.js
│  └── server.js
📁 prisma/
│  └── migrations
│  └── client.js
│  └── schema.prisma
📁 uploads/ ← Arquivos recebidos
📄 .env
📄 .gitignore
📄 docker-compose.yml
📄 dockerfile
📄 package.json
📄 swagger-output.json
```

---

## Funcionalidades Implementadas

### Autenticação

* **POST `/auth/register`** – Registro de novo usuário
* **POST `/auth/login`** – Gera JWT
* **GET `/auth/me`** – Retorna dados do usuário autenticado

### Upload e Ingestão de Dados

* **POST `/datasets/upload`**

  * Aceita arquivos `.csv` e `.pdf`
  * Armazena localmente
  * Registra metadados: nome, tamanho, data e usuário
  * Extrai registros `.csv` para campo JSON em `records`

### Consulta e Listagem

* **GET `/datasets`** – Lista datasets do usuário
* **GET `/datasets/:id/records`** – Lista registros de um dataset
* **GET `/records/search?query=palavra`** – Busca textual nos registros JSON

### Consulta com IA (Mock de Q\&A)

* **POST `/queries`**
  Envie uma pergunta + `datasetId`
  ➤ IA tenta responder com base nos dados dos registros do dataset

* **GET `/queries`** – Lista o histórico de perguntas e respostas do usuário

---

## IA Utilizada

* Integração com [@xenova/transformers](https://www.npmjs.com/package/@xenova/transformers)
* Modelo utilizado: `distilbert-base-cased-distilled-squad` (offline)
* Pipeline: `question-answering`

---

## Exemplo de Upload

Use o Swagger para fazer upload de um `.pdf` com conteúdo como:

```
As escolas brasileiras seguem um sistema estruturado: Educação Infantil (0-5 anos, opcional), Ensino Fundamental (6-14 anos, obrigatório, 9 anos), e Ensino Médio (15-17 anos, 3 anos).
As escolas públicas são gratuitas, mas muitas vezes têm poucos recursos, enquanto as escolas particulares oferecem melhor infraestrutura, porém com mensalidades (podendo custar até R$5.000/mês).
O ano letivo vai de fevereiro a dezembro, com férias em julho e em dezembro-janeiro.
As disciplinas básicas incluem Português, Matemática, História e Ciências, com Inglês/Espanhol como línguas estrangeiras.
O uso de uniforme (camiseta branca + calça/saia escura) é comum.
A nota mínima para aprovação geralmente é 5 (em uma escala de 0 a 10).
O ENEM e os vestibulares são os principais exames para entrar na universidade.
Entre os desafios estão a evasão escolar e greves de professores, mas eventos culturais, como as Festas Juninas, trazem diversão.
Em algumas regiões rurais, há até escolas-barcos para transporte de alunos!
```

E consulte com perguntas como:

* "Qual é a nota mínima para passar de ano na maioria das escolas?"
* "As escolas públicas no Brasil são pagas?"


## Licença

Este projeto é apenas para fins acadêmicos e demonstração técnica.

---

## Autor

Caio Pessoa
[LinkedIn](https://www.linkedin.com/in/caio-al-pessoa) | [GitHub](https://github.com/caio11pessoa)
