FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/build ./build
COPY --from=builder /app/documentation ./documentation

RUN mkdir -p src/uploads src/downloads

EXPOSE 3000

CMD ["node", "build/main"]
