# syntax=docker/dockerfile:1.7

FROM public.ecr.aws/lambda/nodejs:22 AS deps
WORKDIR /tmp
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --omit=dev --workspaces --include-workspace-root

FROM public.ecr.aws/lambda/nodejs:22 AS build-deps
WORKDIR /tmp
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspaces --include-workspace-root

FROM public.ecr.aws/lambda/nodejs:22 AS build
WORKDIR /build
COPY --from=build-deps /tmp/node_modules ./node_modules
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
WORKDIR /build/packages/shared
RUN npx tsc
WORKDIR /build/apps/api
RUN npx nest build

FROM node:22-slim
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 \
     /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=8080
ENV AWS_LWA_INVOKE_MODE=response_stream
WORKDIR /var/task
COPY --from=deps /tmp/node_modules ./node_modules
COPY --from=build /build/packages/shared/dist ./packages/shared/dist
COPY --from=build /build/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /build/apps/api/dist ./
CMD ["node", "main.js"]
