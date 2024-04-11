FROM node:21-alpine AS build

RUN mkdir /home/app && chown node:node /home/app
WORKDIR /home/app

COPY --chown=node:node package.json package-lock.json* ./

USER node

RUN npm ci --only=production

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

COPY --chown=node:node . .

CMD ["node", "dist/main"]
