FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN yarn config set registry https://package-mirror.liara.ir/repository/npm/
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

CMD ["yarn", "start", "--", "-p", "3001"]