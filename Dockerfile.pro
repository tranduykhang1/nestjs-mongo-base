FROM node:16 AS production

ENV TZ="Asia/Seoul"

RUN mkdir /home/app && chown node:node /home/app
WORKDIR /home/app

USER node
COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

COPY --chown=node:node . .
