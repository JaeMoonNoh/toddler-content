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

## 공공 데이터 수집

`apps/api/.env`에 `DATA_GO_KR_SERVICE_KEY`(공공데이터포털 일반 인증키)가 있어야 합니다.

```bash
pnpm collect
```

Docker로 띄운 상태라면 컨테이너 안에서도 실행할 수 있습니다.

```bash
docker compose exec api node dist/daily-check/infrastructure/daily-check.cli.js
```

수집 결과 아래에 혜택 검토 요약이 함께 나옵니다. 사람이 확인한 뒤로 원본이 바뀌었거나 사라진 혜택이 있으면 `⚠ 혜택 검토: 확인 필요 N건`과 혜택 이름, 바뀐 필드를 보여줍니다.

```
⚠ 혜택 검토: 확인 필요 1건 (원본 바뀜 1 · 원본 사라짐 0 · 원본 없음 0), 검증 전 111건
    원본 바뀜  아동수당 (지원내용)
자세히 보기: pnpm benefit review
```

API 서버는 매일 새벽 4시(한국 시각)에 같은 일을 자동으로 하고 결과를 로그에 남깁니다 (`docker compose logs api`). 확인할 혜택이 있거나 실패가 있으면 경고(WARN)로 남깁니다. 끄려면 `COLLECT_SCHEDULE=off`.

## 혜택 검토와 게시

사이트에 올릴 혜택은 `apps/api/data/benefit-catalog.json`에서 관리하고, `GET /benefits`로 나갑니다. 사람이 원문을 확인하기 전에는 "검증 전"으로 표시되고, 원본이 출처에서 사라진 혜택은 빠집니다.

```bash
pnpm benefit sync                 # 목록 파일을 DB에 반영
pnpm benefit review               # 확인이 필요한 혜택 보기 (바뀐 원본은 필드별 전후 값까지)
pnpm benefit verify <slug> ...    # 원문을 확인한 혜택에 확인일 남기기
```

Docker 안에서는 `docker compose exec api node dist/benefit/infrastructure/cli/benefit.cli.js <명령>`.

## 구조

```
apps/api     NestJS 서버
apps/web     Next.js 화면
prototype/   초기 단일 HTML 프로토타입
```
