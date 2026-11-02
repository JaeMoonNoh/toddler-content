# 빌드 컨텍스트는 저장소 루트 (docker compose가 지정)

FROM node:22-alpine AS deps
WORKDIR /app
# 워크스페이스 전체 package.json이 있어야 lockfile 검증을 통과한다
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/api

FROM deps AS build
COPY apps/api apps/api
RUN npm run build -w apps/api

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/api --omit=dev && npm cache clean --force
COPY --from=build /app/apps/api/dist apps/api/dist
USER node
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
