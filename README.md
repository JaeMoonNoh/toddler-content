# toddler-content

지역과 출산예정일만 넣으면 받을 수 있는 임신·출산·육아 혜택과 신청 일정을 보여주는 서비스.

## 로컬 실행

Docker가 켜져 있어야 합니다.

```bash
docker compose up --build
```

- 웹: http://localhost:3000
- API: http://localhost:4000/health
- PostgreSQL: localhost:5432 (기본 계정은 `.env.example` 참고)

종료: `docker compose down` (DB 데이터까지 지우려면 `docker compose down -v`)

## Docker 없이 개발

```bash
pnpm install
docker compose up -d db
cp apps/api/.env.example apps/api/.env
pnpm dev:api   # http://localhost:4000
pnpm dev:web   # http://localhost:3000
```

DB 스키마를 바꿨다면 `pnpm --filter @toddler/api db:migrate --name <변경내용>`

## 구조

```
apps/api     NestJS 서버
apps/web     Next.js 화면
prototype/   초기 단일 HTML 프로토타입
```
