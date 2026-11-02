# toddler-content

임신·출산·육아 공공 혜택을 지역과 출산예정일만으로 바로 조회하는 서비스.

## 왜 만드는가

- 육아 인플루언서의 "댓글 달면 DM으로 보내드려요" 구조를 대체한다. 정보는 숨기지 않고 누구나 바로 본다.
- 원본은 국가·지자체 정책(보조금24, 복지로, 복지멤버십 등). 이 서비스는 그 정보를 가공해 빠르고 보기 쉽게 보여준다.
- 인스타그램은 요약본을 올리는 창구로만 쓰고, 자세한 내용은 사이트로 안내한다.
- 범위: 지금은 임신·출산·영유아. 이후 초등·중등·고등 혜택으로 넓힌다.

## 제품 원칙

- 회원가입·로그인 없음. 개인정보(임신 여부, 출산예정일)는 서버에 저장하지 않는다. 계산은 가능한 한 브라우저에서 한다.
- 모든 혜택에는 **출처 링크**와 **최종 확인일**을 붙인다. 확인되지 않은 값은 "검증 전"으로 표시하고, 추측한 금액이나 조건을 확정값처럼 넣지 않는다.
- 입력은 주차가 아니라 **출산예정일** 기준. 신청 시작일과 마감일을 실제 날짜로 계산해 타임라인으로 보여준다.
- 신청 마감일은 캘린더(.ics, 구글 캘린더 링크)에 추가할 수 있게 한다.
- 가장 중요한 운영 기능은 **공공 API 변경 감지 자동화**: 매일 공공데이터를 받아 이전과 비교하고, 바뀐 항목만 알려준다. 반영은 사람이 검토한 뒤 한다.
- 수익화(CPA 제휴, 알림 구독)와 Outbox 패턴, 푸시 알림은 트래픽이 생긴 뒤에 다룬다.

## 기술 스택

- 저장소 하나에 백엔드와 프론트엔드를 함께 둔다 (pnpm workspace). 혼자 개발하는 동안은 분리하지 않는다.
- 패키지 매니저는 pnpm만 쓴다. npm, yarn으로 설치하지 않는다 (`pnpm --filter @toddler/api add <패키지>`).
- 백엔드: NestJS (`apps/api`)
- 프론트엔드: Next.js (`apps/web`)
- DB: PostgreSQL
- Node.js 22 이상
- 로컬 실행은 Docker Compose, 배포는 Docker 이미지

```
apps/
  api/        NestJS 서버
  web/        Next.js 화면
prototype/    초기 단일 HTML 프로토타입 (참고용)
docker-compose.yml
```

## 로컬 실행

```bash
docker compose up --build
```

- 웹: http://localhost:3000
- API: http://localhost:4000 (상태 확인: `/health`)
- PostgreSQL: localhost:5432 (계정 정보는 `.env.example` 참고)

Docker 없이 개발할 때는 `pnpm install` 후 `pnpm dev:api`, `pnpm dev:web`.

## Git 규칙

- **커밋 메시지와 PR 본문은 반드시 한글로 쓴다.** 영어로 쓰지 않는다.
- 커밋은 작게, PR도 작게. 한 PR에는 한 가지 목적만 담는다.
- 기본 브랜치는 `main`. 작업은 브랜치를 만들어서 한다 (`feat/…`, `fix/…`, `chore/…`, `docs/…`).
- 이 저장소에서는 Claude가 직접 커밋하고 브랜치를 push해도 된다.
- 이 노트북의 `gh` CLI는 **회사 계정**으로 로그인돼 있다. 이 저장소에서는 `gh`를 쓰지 않는다.
  PR은 브랜치를 push한 뒤 PR 본문을 만들어 GitHub 웹에서 연다
  (`https://github.com/JaeMoonNoh/toddler-content/compare/main...<브랜치>?expand=1`).
- 이 폴더(`~/personal/`)는 개인 SSH 키와 개인 이메일(JaeMoonNoh)로 커밋·push되도록 설정돼 있다. 원격 주소를 https로 바꾸지 않는다.

## 커밋 메시지·PR 제목 형식

`타입(범위): 한글 설명` 형식. 타입과 범위는 영어 소문자, 설명은 한글. 콜론 앞에는 공백을 두지 않는다.

```
feat(api): 혜택 목록 조회 API 추가
fix(web): 출산예정일 입력 시 날짜가 하루 밀리는 문제 수정
chore(deps): 패키지 매니저를 npm에서 pnpm으로 전환
```

| 타입 | 언제 |
|---|---|
| `feat` | 사용자가 체감하는 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작은 그대로, 코드 구조만 변경 |
| `chore` | 설정, 의존성, 빌드, Docker 등 기능과 무관한 작업 |
| `docs` | 문서만 변경 (README, CLAUDE.md) |
| `test` | 테스트만 추가·수정 |

| 범위 | 대상 |
|---|---|
| `api` | `apps/api` (NestJS) |
| `web` | `apps/web` (Next.js) |
| `db` | Prisma 스키마, 마이그레이션 |
| `data` | 혜택 데이터, 공공 API 수집·변경 감지 |
| `docker` | Dockerfile, docker-compose |
| `deps` | 패키지 추가·버전 변경 |

- 범위가 여러 곳이면 가장 중심이 되는 하나만 쓰고, 애매하면 생략한다 (`docs: …`).
- PR 제목도 같은 형식. 브랜치 이름은 타입과 맞춘다 (`feat/…`, `fix/…`).

## PR 본문 형식

```
## 무엇을
- 변경 내용 요약

## 왜
- 이 변경이 필요한 이유

## 확인 방법
- 직접 실행해 볼 명령이나 확인할 화면
```
