# 빌드 컨텍스트는 저장소 루트 (docker compose가 지정)

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS build
# 의존성 설치 레이어를 소스 변경과 분리해서 캐시를 살린다
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @toddler/api
COPY apps/api apps/api
RUN pnpm --filter @toddler/api build
# 실행에 필요한 파일과 운영 의존성만 /out으로 모은다
RUN pnpm --filter @toddler/api deploy --prod --legacy /out

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
