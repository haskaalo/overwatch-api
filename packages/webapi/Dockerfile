FROM node:8-alpine

WORKDIR /usr/src/app
ADD ./packages/owapi/* /usr/src/app/

RUN yarn

EXPOSE 3000

CMD ["node", "server.js"]