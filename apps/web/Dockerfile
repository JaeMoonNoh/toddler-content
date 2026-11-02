# 빌드 컨텍스트는 저장소 루트 (docker compose가 지정)

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
# 의존성 설치 레이어를 소스 변경과 분리해서 캐시를 살린다
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @toddler/web
COPY apps/web apps/web
RUN pnpm --filter @toddler/web build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
# standalone 출력에 실행에 필요한 node_modules까지 들어 있다
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
