FROM node:18-slim

WORKDIR /app

COPY package.json .
RUN corepack enable

COPY .yarn .yarn
COPY .yarnrc.yml .
COPY yarn.lock .
COPY server/package.json server/

RUN yarn workspaces focus @worshipmate/server --production
RUN yarn install

COPY tsconfig.base.json .
COPY server/ server/

EXPOSE 8080
CMD ["yarn", "server", "start:prod"]
