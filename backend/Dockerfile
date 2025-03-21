FROM node:14

WORKDIR /app

COPY . .

RUN npm init -y

RUN npm install express pg cors

EXPOSE 3000

CMD ["npm", "start"]