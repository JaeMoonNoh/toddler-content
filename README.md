# toddler-content

사는 곳과 출산예정일만 넣으면, 받을 수 있는 임신·출산·육아 공공 혜택과 신청 일정을 날짜로 보여주는 서비스.

- 로그인은 선택. 로그인하지 않으면 출산예정일과 사는 곳은 브라우저 안에서만 쓰고 서버로 보내지 않는다
- 혜택 원본은 공공데이터포털 API(보조금24, 복지로)에서 매일 받아 오고, 사람이 원문과 대조한 뒤 게시한다
- 모든 혜택에 출처 링크와 최종 확인일을 붙인다. 확인 전인 혜택은 "검증 전"으로 표시한다

제품 원칙과 코드 규칙은 [CLAUDE.md](CLAUDE.md), 데이터를 어디서 어떻게 받는지는 [docs/data-sources.md](docs/data-sources.md)에 있다.

## 준비물

| 준비물 | 확인 방법 |
|---|---|
| Docker Desktop | `docker compose version` |
| Node.js 22 이상 (`.nvmrc`) | `node -v` |
| pnpm (`corepack enable`로 켬) | `pnpm -v` |
| 공공데이터포털 인증키 | 아래 참고 |

### 공공데이터포털 인증키

API 서버와 CLI는 인증키가 없으면 **시작하지 않는다** (시작할 때 환경 변수를 검증한다). 화면만 볼 때도 필요하다.

1. [공공데이터포털](https://www.data.go.kr)에 가입하고 로그인한다
2. 아래 4개 데이터셋에서 각각 **활용신청**을 누른다. 인증키는 계정에 하나이고, 데이터셋마다 따로 신청해야 쓸 수 있다
   - [행정안전부_대한민국 공공서비스(혜택) 정보](https://www.data.go.kr/data/15113968/openapi.do) (보조금24)
   - [한국사회보장정보원_중앙부처복지서비스](https://www.data.go.kr/data/15090532/openapi.do) (복지로 중앙부처)
   - [한국사회보장정보원_지자체복지서비스](https://www.data.go.kr/data/15108347/openapi.do) (복지로 지자체)
   - [행정안전부_행정표준코드_법정동코드](https://www.data.go.kr/data/15077871/openapi.do) (지역 목록. 이미 받아 둔 파일이 있어서 지역을 새로 받을 때만 필요)
3. 마이페이지에서 **일반 인증키(Decoding)**를 복사한다

인증키는 `apps/api/.env`에만 둔다. 이 파일은 git에 올라가지 않는다. `.env.example`이나 커밋, 채팅에 붙여 넣지 않는다.

### 카카오 로그인 (선택)

키를 넣지 않으면 로그인 버튼이 나오지 않고, 나머지는 그대로 쓸 수 있다. 콘솔 메뉴 이름은 바뀔 수 있다.

1. [카카오 개발자](https://developers.kakao.com)에 로그인하고 **내 애플리케이션 > 애플리케이션 추가**로 앱을 만든다
2. **앱 키**에서 **REST API 키**를 복사한다
3. **카카오 로그인**을 켜고, **Redirect URI**에 `http://localhost:3000/api/auth/kakao/callback`을 등록한다 (배포하면 `{웹 주소}/api/auth/kakao/callback`을 더한다)
4. **동의항목**은 아무것도 켜지 않는다. 회원번호만 쓴다
5. `apps/api/.env`에 `KAKAO_REST_API_KEY=`를 넣고 `docker compose up -d api`로 다시 띄운다
   - **보안**에서 Client Secret을 켰다면 `KAKAO_CLIENT_SECRET=`도 넣는다

## 처음 실행하기

순서대로 하면 로컬에서 사이트가 뜬다.

### 1. 받고 설치하기

```bash
git clone git@github.com:JaeMoonNoh/toddler-content.git
cd toddler-content
pnpm install          # 커밋 전 lint 훅(husky)도 함께 연결된다
cp apps/api/.env.example apps/api/.env
```

`apps/api/.env`를 열어 `DATA_GO_KR_SERVICE_KEY=` 뒤에 인증키를 붙인다.

### 2. 띄우기

```bash
docker compose up -d --build
```

| 서비스 | 주소 |
|---|---|
| 웹 | http://localhost:3000 |
| API | http://localhost:4000/health (`{"status":"ok","db":"ok"}`면 정상) |
| PostgreSQL | localhost:5432 (계정은 `.env.example`) |

API 컨테이너는 시작할 때 DB 마이그레이션을 자동으로 적용한다.

### 3. 공공 데이터 받기

```bash
pnpm collect
```

- 보조금24, 복지로 중앙부처·지자체 원본 약 1만 6천 건을 받는다. 몇 분 걸린다
- 처음 받으면 "첫 수집이라 기준점만 저장"이라고 나온다. 다음 수집부터 바뀐 항목만 알려준다

**이 단계를 건너뛰면 사이트에 혜택이 하나도 보이지 않는다.** 원본이 수집되지 않은 혜택은 "원본 없음"으로 보고 게시하지 않기 때문이다.

### 4. 혜택 목록 반영하기

```bash
pnpm benefit sync
```

`apps/api/data/benefit-catalog.json`(사람이 정리한 혜택 목록)을 DB에 넣는다. 처음이면 "새로 등록 N"이 나온다.

### 5. 확인하기

http://localhost:3000 에서

1. 사는 곳: **충청북도 → 청주시** 또는 **인천광역시 → 연수구**
2. 출산예정일: 아무 날짜나 (예: 6개월 뒤)

신청 타임라인, 받을 수 있는 금액 합계, 지역별 혜택이 나오면 성공이다.

> 처음 받은 환경에서는 모든 혜택이 **"검증 전"**으로 보인다. 원문을 확인한 기록(`pnpm benefit verify`)은 git이 아니라 각자의 DB에 남기 때문이다. 화면 확인이나 개발에는 문제없다.

### 끄기

```bash
docker compose down       # 컨테이너만 끈다 (DB 데이터는 남는다)
docker compose down -v    # DB 데이터까지 지운다 (다시 3~4단계부터)
```

## 자주 쓰는 명령

모두 저장소 맨 위 폴더에서 실행한다. `pnpm collect`, `pnpm benefit …`, `pnpm region …`은 로컬 DB(localhost:5432)에 붙으므로 `docker compose up -d db`가 켜져 있어야 한다.

| 명령 | 하는 일 |
|---|---|
| `pnpm --filter @toddler/api test` | API 타입 검사 + 테스트 |
| `pnpm --filter @toddler/web test` | 웹 타입 검사 + 테스트 |
| `pnpm --filter @toddler/api lint` | API lint (`lint:fix`로 자동 수정) |
| `pnpm collect` | 공공 API 수집 + 혜택 검토 요약 (서버는 매일 새벽 4시에 자동으로 한다) |
| `pnpm benefit sync` | 혜택 목록 파일을 DB에 반영 |
| `pnpm benefit review` | 확인이 필요한 혜택 보기 |
| `pnpm benefit review <slug>` | 혜택 하나의 정리 내용과 지금 원문을 나란히 보기 |
| `pnpm benefit verify <slug> …` | 원문을 확인한 혜택에 확인일 남기기 |
| `pnpm benefit retire <slug> …` | 목록 파일에서 뺀 혜택을 DB와 사이트에서도 지우기 |
| `pnpm benefit candidates <지역코드>` | 그 지역과 아래 지역의 혜택 후보를 md 표로 뽑기 (예: 인천 `2800000000`) |
| `pnpm benefit add <지역코드> <판단.json>` | 후보 md에서 고른 것을 혜택 목록에 카드로 넣기 (이름 정리, 신청 방법 초안) |
| `pnpm benefit plan-texts <지역코드> <폴더>` | 일정·금액이 빈 카드의 원문을 md로 나눠 쓰기 (초안 쓸 때 읽는 자료) |
| `pnpm benefit candidate-texts <지역코드> <폴더>` | 후보마다 원문(지원대상·지원내용)을 붙여 md로 나눠 쓰기 (고를 때 읽는 자료, 60건씩) |
| `pnpm benefit compare-decisions <A.json> <B.json>` | 같은 후보를 따로 고른 두 판단에서 갈린 것만 보기 |
| `pnpm benefit plan-check <초안.json> [...]` | 일정·금액 초안 검사 (규칙: [docs/benefit-plan-rules.md](docs/benefit-plan-rules.md))와 근거 인용이 원문에 그대로 있는지 |
| `pnpm benefit plan-verify <폴더> <초안.json> [...]` | 날짜·합계 금액이 있는 초안만 원문과 나란히 모아 대조용 md로 쓰기 (25건씩) |
| `pnpm benefit plan-apply <초안.json>` | 검사를 통과한 초안을 혜택 목록 파일에 넣기 |
| `pnpm region sync` | 행정안전부 법정동코드로 지역 목록(`data/regions.json`) 새로 받기 |
| `pnpm --filter @toddler/api db:migrate --name <변경내용>` | DB 스키마를 바꾼 뒤 마이그레이션 만들기 |

Docker 없이 서버를 띄우려면 `docker compose up -d db` 후 `pnpm dev:api`, `pnpm dev:web`.

## 혜택이 사이트에 올라가기까지

```
공공 API ──pnpm collect──▶ 원본(DB) ──┐
                                      ├──▶ pnpm benefit sync ──▶ 게시 ("검증 전")
혜택 목록 파일(benefit-catalog.json) ──┘                              │
                                                    원문과 대조 후 pnpm benefit verify
                                                                      ▼
                                                          게시 ("최종 확인 YYYY.MM.DD")
```

- 혜택 목록 파일에는 이름, 지역(법정동코드), 원본 ID, 신청 일정, 금액, 조건, 대상 묶음, 신청 방법을 사람이 정리해 둔다. 형식은 [docs/data-sources.md](docs/data-sources.md)
- 매일 수집하다가 확인한 뒤로 원본이 바뀌면 "원본 바뀜"으로 알려준다. 원문을 다시 보고 verify하면 된다
- 정리 내용을 바꾸면 그 혜택은 다시 "검증 전"이 된다

### 지역을 넓히는 순서

1. `pnpm benefit candidates <지역코드>`로 후보 md를 뽑는다 (지역코드는 `apps/api/data/regions.json`의 `code`)
2. `pnpm benefit candidate-texts`로 후보 원문 md를 만들고, subagent 둘이 [고르기 규칙](docs/benefit-candidate-rules.md)대로 각자 판단 파일(JSON)을 쓴다. `pnpm benefit compare-decisions`로 갈린 것만 보고 main이 원문으로 판정해 판단 파일 하나로 합친다
3. `pnpm benefit add <지역코드> <판단.json>`으로 카드를 넣는다. 판단 파일을 그대로 넣으면 된다 (`merge`로 합친 후보는 대표 카드의 두 번째 원본이 된다). 고른 이유는 `docs/research/`에 남긴다 (예: [인천](docs/research/2026-11-03-incheon-candidates.md))
4. `pnpm benefit plan-texts`로 원문 md를 만들고 초안을 쓴다 → `plan-check`(형식·합계 규칙·인용)를 통과시킨다 → `plan-verify`로 만든 md를 다른 subagent가 원문과 대조하고, 갈린 것만 main이 판정한다 → `plan-apply` ([규칙](docs/benefit-plan-rules.md))
5. PR 머지 → `pnpm benefit sync` → `pnpm benefit verify`

코드는 고치지 않아도 된다. 화면의 지역 선택은 지역 목록 파일에서 만들어진다.

## 폴더 구조

```
apps/
  api/                     NestJS 서버와 CLI
    data/                  benefit-catalog.json(혜택 목록), regions.json(지역 목록)
    prisma/                DB 스키마와 마이그레이션
    src/
      collect/             공공 API 수집과 변경 감지
      benefit/             혜택 목록, 검토·확인, 공개 API, 후보 뽑기
      region/              행정구역(법정동코드) 트리
      daily-check/         매일 수집 + 검토 요약 (새벽 4시 스케줄러)
      shared/              기능끼리 함께 쓰는 개념과 HTTP 클라이언트
      config/              환경 변수 검증
  web/                     Next.js 화면 (계산은 src/benefits/domain, 화면은 src/benefits/ui)
docs/
  data-sources.md          데이터 출처, 규칙(일정·금액·조건·대상 묶음)
  research/                지역별 혜택 후보와 고른 이유
prototype/                 초기 단일 HTML 프로토타입 (참고용)
```

기능마다 `domain/`(규칙) → `application/`(서비스) → `infrastructure/`(DB, API, CLI) 세 층으로 나눈다. 자세한 규칙은 [CLAUDE.md](CLAUDE.md).

## 기여하기

- `main`에서 브랜치를 만들어 작업한다 (`feat/…`, `fix/…`, `chore/…`, `docs/…`)
- 커밋 메시지와 PR은 한글로, `타입(범위): 설명` 형식 (예: `feat(data): 인천 혜택 49건 추가`)
- 커밋하면 훅이 API의 lint와 타입 검사를 돌리고, 오류가 있으면 커밋을 막는다
- 한 PR에는 한 가지 목적만 담는다

## 문제가 생기면

| 증상 | 해결 |
|---|---|
| API가 "환경 변수가 올바르지 않습니다"로 멈춤 | `apps/api/.env`에 `DATA_GO_KR_SERVICE_KEY`와 `DATABASE_URL`이 있는지 확인 |
| 수집이 "등록되지 않은 인증키" 또는 HTTP 403으로 실패 | 그 데이터셋의 활용신청이 승인됐는지 공공데이터포털 마이페이지에서 확인 (승인 직후에는 몇 분 걸릴 수 있다) |
| 사이트에 혜택이 하나도 없음 | `pnpm collect` → `pnpm benefit sync`를 했는지 확인. `pnpm benefit review`에서 "원본 없음" 건수를 본다 |
| 혜택을 고쳤는데 화면이 그대로 | 웹이 API 응답을 5분 동안 재사용한다. 기다리거나 `docker compose up -d --force-recreate web` |
| `pnpm benefit …`이 DB에 연결하지 못함 | `docker compose up -d db`로 DB를 켠다 |
| 5432, 3000, 4000 포트가 이미 쓰이는 중 | 다른 프로그램을 끄거나, DB 포트는 루트 `.env`(`.env.example`을 복사)의 `POSTGRES_PORT`로 바꾸고 `apps/api/.env`의 `DATABASE_URL` 포트도 같이 바꾼다 |
