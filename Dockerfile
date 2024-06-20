FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]