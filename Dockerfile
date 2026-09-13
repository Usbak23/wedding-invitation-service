# ====================================================================
# Build Stage
# ====================================================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ====================================================================
# Production Runner Stage
# ====================================================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/documentation ./documentation

RUN mkdir -p src/uploads src/downloads && chown -R node:node /app

USER node

EXPOSE 3010

CMD ["node", "build/main"]
