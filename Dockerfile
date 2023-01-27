FROM node:lts-alpine

RUN apk add dumb-init

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app/

RUN npm ci --only=production

CMD [ "dumb-init", "npm", "start" ]