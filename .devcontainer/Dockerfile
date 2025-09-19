FROM node:22-alpine3.19

RUN apk add git openssh-client

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
ENV PNPM_HOME=/usr/local/bin

# fix ERR_PNPM_ENAMETOOLONG
RUN mkdir /opt/pnpm-store
RUN pnpm config set store-dir /opt/pnpm-store

RUN pnpm add @angular/cli -g

RUN mkdir -p /api

# Change directory so that our commands run inside this new directory
WORKDIR /api