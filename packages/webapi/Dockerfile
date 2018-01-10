FROM node:8-alpine

ARG source
WORKDIR /usr/src/app
ADD {source:-/packages/owapi} ./usr/src/app

RUN yarn

EXPOSE 3000

CMD ["node", "server.js"]