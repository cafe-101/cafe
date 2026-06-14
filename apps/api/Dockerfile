FROM node:22-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
# Enable corepack for pnpm
RUN corepack enable pnpm

WORKDIR /app
RUN pnpm install -g turbo@2.9.18

COPY . .
RUN turbo prune api --docker

FROM node:22-alpine AS installer
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable pnpm
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=api...

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 fastify
RUN adduser --system --uid 1001 fastify
USER fastify

COPY --from=installer /app .

EXPOSE 4040

CMD ["pnpm", "--filter", "api", "start"]
