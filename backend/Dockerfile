FROM node:20

WORKDIR /var/www/html/remmed-api

RUN apt-get update && apt-get install -y \
  openssl \
  curl \
  ca-certificates \
  build-essential

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
