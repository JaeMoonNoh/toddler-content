# 빌드 컨텍스트는 저장소 루트 (docker compose가 지정)

FROM node:22-alpine AS deps
WORKDIR /app
# 워크스페이스 전체 package.json이 있어야 lockfile 검증을 통과한다
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/web

FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY apps/web apps/web
RUN npm run build -w apps/web

FROM node:22-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
# standalone 출력에 실행에 필요한 node_modules까지 들어 있다
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
