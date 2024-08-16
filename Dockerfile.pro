FROM node:21-alpine AS build

RUN mkdir -p /home/app && chown -R node:node /home/app

WORKDIR /home/app

USER node

COPY package.json package-lock.json ./
RUN npm install --unsafe-perm

COPY . .

RUN npm run build --unsafe-perm

FROM node:21-alpine AS production

RUN mkdir -p /home/app && chown -R node:node /home/app

WORKDIR /home/app

USER node

COPY --from=build --chown=node:node /home/app/dist ./dist
COPY --from=build --chown=node:node /home/app/node_modules ./node_modules

EXPOSE $API_PORT

CMD ["node", "dist/main"]

USER node

