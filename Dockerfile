FROM node:21-alpine AS development

RUN mkdir /home/app && chown node:node /home/app
WORKDIR /home/app

USER node
COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

COPY --chown=node:node . .
