# =========================
# 1️⃣ Base image
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# 2️⃣ Install root dependencies
# =========================
FROM base AS deps
COPY package*.json ./
RUN npm install

# =========================
# 3️⃣ Build server
# =========================
FROM base AS server-build
COPY --from=deps /app/node_modules ./node_modules
COPY server ./server
WORKDIR /app/server
RUN npm install && npm run build

# =========================
# 4️⃣ Build client
# =========================
FROM base AS client-build
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# =========================
# 5️⃣ Production image
# =========================
FROM node:20-alpine AS production
WORKDIR /app

# Copier uniquement le nécessaire
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/dist ./client/dist
COPY package*.json ./

WORKDIR /app/server
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
