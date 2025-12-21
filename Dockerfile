FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --registry https://registry.npmjs.org/ --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

# ---------- runner ----------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

USER node

EXPOSE 3001
CMD ["node", "dist/main.js"]
