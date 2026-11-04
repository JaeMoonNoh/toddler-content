# 서울특별시 임신·출산·영유아 혜택 후보 목록
- 뽑은 날: 2026-11-04 (`pnpm benefit candidates 1100000000`)
- 출처: 수집해 둔 보조금24(지자체 혜택)와 복지로 지자체. 이미 혜택 목록에 있는 원본은 뺐어요
- 고르는 법: 넣을 항목만 `[ ]`를 `[x]`로 바꿔 주세요. 애매하면 링크로 원문을 확인해요
- 신뢰도 **강함**: 이름이나 생애주기가 임신·출산·영유아. **후보**: 설명에만 관련 단어가 있거나 대상이 넓음
- 모두 296건 (강함 145 · 후보 151)

## 검토 결과 (2026-11-04)

- 방법: 296건을 50건씩 6개 파일로 나눠 다른 AI가 1차로 고르고, 수집해 둔 원문(지원대상, 지원내용)과 대조해 고쳤다
- 기준: 인천·청주와 같이 **출산·육아·입양·난임·아이와 관련된 혜택은 포함**
- 포함 152건은 `[x]`. 나머지 144건은 아래 "제외한 항목" 113건과 "합친 원본" 31건
- 송파구 출산축하금(286번)은 처음에 포함했다가, 일정·금액을 정리하면서 원문의 출생 시기 제한("2021.12.31.이전 출생아까지만 지급")을 발견해 뺐다
- 서울에서 새로 정한 기준
  - **구가 자기 예산으로 더 주는 것은 전국 혜택이 있어도 넣는다.** 산모·신생아 건강관리 본인부담금 추가 지원, 난임 시술 약제비, 한의약 난임 치료, 구 입양축하금·입양장려금, 미숙아 RSV 예방접종비
  - **대상이 다르면 다른 사업이다.** 남성장애인 출산비용, 구 장애인가정 출산지원금·양육지원금은 전국 "여성장애인 출산비용지원"과 별개
  - **구 보건소의 임산부 등록·검사 서비스는 구마다 넣는다.** 기형아·당뇨 검사, 유축기 대여까지 있어 전국 엽산제·철분제보다 넓다
  - **다자녀(자녀 수) 조건은 아이 조건이다.** 하수도사용료 감면, 다자녀 장려금 등은 넣는다
  - **만 0~6세가 대상에 들어가면 넣는다.** 3~5세 보육료 차액 지원 등
  - 시설 이용료 감면 규정(성북구 육아종합센터 6건)과 기업 대상 인센티브(워라밸 포인트제)는 뺀다
  - 같은 혜택의 보조금24판과 복지로판은 보조금24 쪽을 대표로 하고 복지로 쪽을 두 번째 원본으로 합친다
- 검증 때 따로 볼 것
  - 서울시 저소득·비혼모 본인부담금 지원(3번)과 구 본인부담금 지원(40, 59, 101, 137, 147, 221, 271번)이 겹치는지
  - 서울시 난임부부 시술비(7번, 제외)에 붙은 "서울형 난임시술중단 의료비 지원"을 따로 카드로 만들지
  - 누리과정 차액보육료(207번)가 서울시 일반아동 보육료 차액지원(32번)과 같은 사업인지
  - 종로구 가정위탁·입양가정 지원(36번), 강남구 입양·가정위탁 지원(275번)은 입양 부분만 안내할지
  - 복지로 요약뿐이라 내용을 확인 못 한 것: 70번 성동구 임산부 가사돌봄, 76번 아픈아이 병원 동행(나이), 168번 서대문구 공공산후조리원 감면, 199번 구로구 입양가정 지원
- 정리 때 볼 것
  - 전국 목록에 "어린이 국가예방접종"이 없다. 모든 아이가 받는 혜택이라 전국 카드 추가를 검토한다 (78, 251번에서 발견)
  - 인천 카탈로그의 구 "영유아 발달 정밀검사비 지원" 2건(미추홀·연수)이 전국 카드와 겹쳐 보일 수 있다

## 서울특별시 (35건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 1 | [x] | [1인 자영업자, 프리랜서 등 출산휴가급여(임산부, 배우자)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2161854&bnefType=all&svcId=611000019649) | 1인 자영업자등 임산부 90만원 지원, 배우자를 둔 1인 자영업자 등에게 최대 120만원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000019649` |
| 2 | [x] | [남성장애인 출산비용 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003364&bnefType=all&svcId=611000000135) | 출산한 배우자를 둔 남성장애인에게 출산비용 지원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000000135` |
| 3 | [x] | [산모·신생아건강관리본인부담금지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004300&bnefType=all&svcId=611000000139) | 산모신생아 건강관리 서비스 이용금액중 본인부담금 90% 지원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000000139` |
| 4 | [ ] | [산모·신생아건강관리지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002454&bnefType=all&svcId=611000000124) | 서울시 출산가정에 산모의 산후회복과 신생아의 양육을 지원 | 서울특별시 | 보조금24, 복지로 | 강함 | `gov24-611000000124` |
| 5 | [ ] | [서울시 1인 자영업자 등 배우자 출산휴가급여 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005866&wlfareInfoReldBztpCd=02) | 자영업자 등의 모성보호와 경제적 부담 완화 | 서울특별시 여성가족실 저출생담당관 | 복지로 | 강함 | `bokjiro-wlf00005866` |
| 6 | [ ] | [서울시 1인 자영업자 등 임산부 출산급여 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005864&wlfareInfoReldBztpCd=02) | 1인 자영업자등의 모성보호와 경제적 부담 완화 | 서울특별시 여성가족실 저출생담당관 | 복지로 | 강함 | `bokjiro-wlf00005864` |
| 7 | [ ] | [서울시 난임부부 시술비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005917&bnefType=all&svcId=611000000159) | 서울시 난임부부(사실혼 포함) 난임시술비 출산당 총 25회 지원(누적) | 서울특별시 | 보조금24 | 강함 | `gov24-611000000159` |
| 8 | [x] | [서울시 다태아 안심보험 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2149038&bnefType=all&svcId=611000019621) | '24.1.1. 이후 출생한 서울시 주민등록 다태아(쌍둥이)에 대하여 자녀보험 가입 지원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000019621` |
| 9 | [x] | [서울시 임산부 교통비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2147867&bnefType=all&svcId=611000019618) | 서울시 3개월 이상 거주 임산부 대상 교통비 바우처 70~100만원 지급 | 서울특별시 | 보조금24 | 강함 | `gov24-611000019618` |
| 10 | [ ] | [서울시 중소기업 워라밸 포인트제 서울형 출산휴가급여 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006026&wlfareInfoReldBztpCd=02) | '서울시 중소기업 워라밸 포인트제'는 서울시 소재 중소기업이 아이 키우기 좋은 기업으로 성장할 수 있도록 서울시 소재 중소기업에 양육친화, 일·… | 서울특별시 여성가족실 저출생담당관 | 복지로 | 강함 | `bokjiro-wlf00006026` |
| 11 | [x] | [서울시한의약난임치료지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001732&bnefType=all&svcId=611000000123) | 원인불명의 난임부부에게 한의약 난임치료 비용 지원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000000123` |
| 12 | [x] | [서울형 산후조리경비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2144816&bnefType=all&svcId=611000019610) | 산후조리경비 바우처 지원 | 서울특별시 | 보조금24, 복지로 | 강함 | `gov24-611000019610` |
| 13 | [x] | [서울형 안심 산후조리원 운영 시범사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006653&wlfareInfoReldBztpCd=02) | 일정 조건을 충족하는 민간산후조리원에 사업비 및 이용료 보전 등 지원을 통해 합리적 가격으로 양질의 산후조리 서비스 제공 | 서울특별시 시민건강국 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00006653` |
| 14 | [ ] | [이주여성 건강관리 지원 (구)다문화가족 출산 전후 돌봄서비스)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005719&bnefType=all&svcId=611000000155) | 임신출산한 결혼이주여성 등을 위해 의료통역, 출산교실, 건강관리 등 지원 | 서울특별시 | 보조금24 | 강함 | `gov24-611000000155` |
| 15 | [x] | [자녀출산 무주택가구 주거비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2149821&bnefType=all&svcId=611000019624) | 자녀를 출산한 서울시 무주택 가구를 대상으로 월 최대 30만원의 주거비를 최대 2년간 지원 | 서울특별시 | 보조금24, 복지로 | 강함 | `gov24-611000019624` |
| 16 | [x] | [저소득 출산가정 본인부담금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003009&wlfareInfoReldBztpCd=02) | 저소득 출산가정의 경제적 부담 완화 | 서울특별시 시민건강국 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00003009` |
| 17 | [ ] | [결식 아동 급식지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005405&bnefType=all&svcId=611000000150) | 결식우려아동에게 급식 지원 | 서울특별시 | 보조금24 | 후보 | `gov24-611000000150` |
| 18 | [x] | [기후동행카드 다자녀·저소득층 할인제도 운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006170&wlfareInfoReldBztpCd=02) | - 출산 친화 분위기 조성 및 교통복지 실현을 위해 맞춤형 할인지원 필요 - 다자녀부모 및 저소득층에 기후동행카드 권종당 최대 17천원 할인 | 서울특별시 교통실 교통기획관 교통정책과 | 복지로 | 후보 | `bokjiro-wlf00006170` |
| 19 | [x] | [꿈나래통장](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2149019&bnefType=all&svcId=611000019620) | 참여자가 자녀교육비 마련을 위해 매월 일정금액을 저축하면 서울시에서 저축액의 50%를 지원 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019620` |
| 20 | [ ] | [뇌병변장애인 신변처리용품 구입비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001941&wlfareInfoReldBztpCd=02) | 신변처리용품(기저귀, 패드 등) 사용에 따른 뇌병변장애인의 생활 불편 및 경제적 부담 완화 | 서울특별시 복지실 복지기획관 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001941` |
| 21 | [x] | [다자녀 가구 하수도사용료 감면](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2148116&bnefType=all&svcId=611000019615) | 2자녀 이상 다자녀 가구에 대해 하수도사용료의 30% 감면 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019615` |
| 22 | [x] | [서울 난자동결 시술비용 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006697&wlfareInfoReldBztpCd=02) | 서울시 6개월 이상 거주 20~49세 여성의 가임력을 보존하고 장래 임신을 위한 지원으로 난자동결 시술비용의 50%, 최대 200만원, 생애 1… | 서울특별시 시민건강국 건강관리과 | 복지로 | 후보 | `bokjiro-wlf00006697` |
| 23 | [x] | [서울시 엄마 북(Book)돋움](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2120101&bnefType=all&svcId=611000019600) | 서울시 거주 임산부 대상 책꾸러미 상자 배송 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019600` |
| 24 | [ ] | [서울시 중소기업 워라밸 포인트제 육아휴직 동료응원수당](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006025&wlfareInfoReldBztpCd=02) | '서울시 중소기업 워라밸 포인트제'는 서울시 소재 중소기업이 아이 키우기 좋은 기업으로 성장할 수 있도록 서울시 소재 중소기업에 양육친화, 일·… | 서울특별시 여성가족실 저출생담당관 | 복지로 | 후보 | `bokjiro-wlf00006025` |
| 25 | [x] | [서울아기 건강 첫걸음(생애초기 건강관리)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2147826&bnefType=all&svcId=611000019613) | 출산한 임산부 및 영유아를 대상으로 가정방문을 통한 건강관리 시행 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019613` |
| 26 | [ ] | [서울특별시 서울형 키즈카페 시립 뚝섬 자벌레점 운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005441&wlfareInfoReldBztpCd=02) | 한강공원 내 놀이 인프라를 연계한 자연 친화적인 실내 놀이시설을 지원하여 아동의 놀이성을 확대 및 강화하고 일시돌봄 제공으로 보호자 양육부담 해… | 서울특별시 광진구 복지국 가정복지과 | 복지로 | 후보 | `bokjiro-wlf00005441` |
| 27 | [x] | [서울형 가사서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2159251&bnefType=all&svcId=611000019636) | 임산부·맞벌이·다자녀 가정의 가사 노동 부담을 경감하고 일·생활 균형 지원 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019636` |
| 28 | [ ] | [서울형 가사서비스 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005849&wlfareInfoReldBztpCd=02) | 서울시 거주 중위소득 180%이하 임산부 맞벌이 다자녀 가정에게 가사서비스를 지원하여 일생활균형 지원 및 아이키우기 좋은환경 조성 | 서울특별시 여성가족실 가족담당관 | 복지로 | 후보 | `bokjiro-wlf00005849` |
| 29 | [x] | [서울형 아이돌봄비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2159267&bnefType=all&svcId=611000019644) | 30만원 상당 서울시 지정 민간 아이돌봄 서비스 이용권 | 서울특별시 | 보조금24, 복지로 | 후보 | `gov24-611000019644` |
| 30 | [ ] | [아동치과치료지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=812101&bnefType=all&svcId=611000000171) | 아동, 청소년에게 예방적 구강건강관리서비스를 제공하여 구강건강수준향상, 구강건강불평등 해소 | 서울특별시 | 보조금24 | 후보 | `gov24-611000000171` |
| 31 | [ ] | [외국인 아동 보육료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005456&wlfareInfoReldBztpCd=02) | 어린이집 외국인 재원 아동에 대한 보육료 지원으로 차별없는 보육환경 조성 및 안정적 보육서비스 제공 | 서울특별시 여성가족정책실 영유아담당관 | 복지로 | 후보 | `bokjiro-wlf00005456` |
| 32 | [x] | [일반아동 보육료 차액지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002815&wlfareInfoReldBztpCd=02) | 정부미지원시설인 민간·가정어린이집을 이용하고 있는 3~5세 아동에 대한 보육료 차액 지원을 통해 보호자의 육아 부담 해소와 건전한 양육 분위기를… | 서울특별시 여성가족정책실 영유아담당관 | 복지로 | 후보 | `bokjiro-wlf00002815` |
| 33 | [x] | [장애인가정 홈헬퍼 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005573&bnefType=all&svcId=611000000153) | 장애인가정을 대상으로 임신, 출산, 자녀양육을 돕는 홈헬퍼 지원 | 서울특별시 | 보조금24 | 후보 | `gov24-611000000153` |
| 34 | [ ] | [취약계층 차열페인트 도장 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006412&wlfareInfoReldBztpCd=02) | 저소득층 거주주택과 장애인 및 노인 거주·요양시설 등에 차열도장을 지원하여 취약계층의 온열질환 예방 및 온실가스 감축에 기여하고자 함. | 서울특별시 기후환경본부 친환경건물과 | 복지로 | 후보 | `bokjiro-wlf00006412` |
| 35 | [ ] | [희망두배 청년통장](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2149018&bnefType=all&svcId=611000019619) | 서울시 거주 중인 근로 청년에게 저축기간에 비례하여 적립액의 1:1 비율로 매칭금 지원 | 서울특별시 | 보조금24 | 후보 | `gov24-611000019619` |

## 서울특별시 종로구 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 36 | [x] | [가정위탁아동 및 입양가정 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006539&bnefType=all&svcId=300000000111) | 가정위탁아동 및 입양가정에 입양장려금, 위문품 등 지원 | 서울특별시 종로구 | 보조금24 | 강함 | `gov24-300000000111` |
| 37 | [x] | [임산부 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000404&bnefType=all&svcId=300000000101) | 임산부 검사,임산부에게 교육을 통한 정보제공,유축기 대여, 엽산제/철분제 등 지원 | 서울특별시 종로구 | 보조금24 | 강함 | `gov24-300000000101` |
| 38 | [x] | [임산부 선천성 태아 기형아 검사 및 풍진 항체검사](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100609&bnefType=all&svcId=300000000140) | 주민등록상 종로구민 임산부를 대상, 선천성 기형아 선별검사와 풍진검사 지원 | 서울특별시 종로구 | 보조금24 | 강함 | `gov24-300000000140` |
| 39 | [ ] | [종로구 둘째아 이상 출산장려 건강보험 가입 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000955&wlfareInfoReldBztpCd=02) | 성장과정에서 발생할 수 있는 질병이나 상해에 대비할 수 있도록 둘째아 이상 영.유아의 건강과 안전을 위하여 건강보험료를 지원함으로써 출산을 장려… | 서울특별시 종로구 복지교육국 아동복지과 | 복지로 | 강함 | `bokjiro-wlf00000955` |
| 40 | [x] | [종로구 산모신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100608&bnefType=all&svcId=300000000139) | 산모신생아 건강관리지원사업 본인부담금 추가지원 | 서울특별시 종로구 | 보조금24 | 강함 | `gov24-300000000139` |
| 41 | [x] | [종로구 출생축하선물 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006468&wlfareInfoReldBztpCd=02) | 종로구 출생 축하선물 지원을 통해 아기의 탄생을 환영하고, 종로 구민으로서의 자긍심을 높여 출산·양육 친화 분위기를 조성하고자 함 | 서울특별시 종로구 복지교육국 아동복지과 | 복지로 | 강함 | `bokjiro-wlf00006468` |
| 42 | [x] | [출산장려 건강보험 가입지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004282&bnefType=all&svcId=300000000108) | 아이가 안심하고 건강하게 자랄 수 있도록 출산장려 건강보험료 지원 | 서울특별시 종로구 | 보조금24 | 강함 | `gov24-300000000108` |
| 43 | [ ] | [아동양육시설 위문](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100506&bnefType=all&svcId=300000000132) | ○ 명절(설, 추석) 및 어린이날 위문비 지급 (1명당 10천원) | 서울특별시 종로구 | 보조금24 | 후보 | `gov24-300000000132` |
| 44 | [ ] | [지역아동센터 운영 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809766&bnefType=all&svcId=300000000117) | 국시비 보조금의 부족분을 구비로 보전함으로써 더 나은 돌봄환경 조성 및 종사자 사기진작 | 서울특별시 종로구 | 보조금24 | 후보 | `gov24-300000000117` |
| 45 | [ ] | [학대피해아동 마음건강지킴이 사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100936&bnefType=all&svcId=300000000166) | 학대피해아동 및 가족구성원 심리상담지원서비스 | 서울특별시 종로구 | 보조금24 | 후보 | `gov24-300000000166` |
| 46 | [ ] | [학대피해아동 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2101101&bnefType=all&svcId=300000000167) | 학대피해아동 의료비 지원 | 서울특별시 종로구 | 보조금24 | 후보 | `gov24-300000000167` |

## 서울특별시 중구 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 47 | [x] | [(서울 중구) 난임부부 시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2130833&bnefType=all&svcId=301000000142) | 난임시술비지원 대상자의 원외약제비 지원 | 서울특별시 중구 | 보조금24 | 강함 | `gov24-301000000142` |
| 48 | [x] | [임산부 등록 관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004405&bnefType=all&svcId=301000000123) | 임산부 검사 및 영양제 지원, 유축기 대여 등 | 서울특별시 중구 | 보조금24 | 강함 | `gov24-301000000123` |
| 49 | [x] | [임신부 가사돌봄 서비스](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004850&wlfareInfoReldBztpCd=02) | 임신부의 가정내 가사돌보미 파견, 가사서비스 등 지원 - 가사 돌봄서비스(청소, 설거지, 세탁, 정리정돈 등) - 임신부 돌봄서비스 (임신부 식… | 서울특별시 중구 복지환경국 가족정책과 | 복지로 | 강함 | `bokjiro-wlf00004850` |
| 50 | [x] | [입양축하금 지급(비장애아동)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005788&bnefType=all&svcId=301000000133) | 입양자에게 입양 시 축하금 지급 | 서울특별시 중구 | 보조금24 | 강함 | `gov24-301000000133` |
| 51 | [x] | [입양축하금 지급(장애아동)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005311&bnefType=all&svcId=301000000130) | 장애아동 입양자에게 입양 시 축하금 지급 | 서울특별시 중구 | 보조금24 | 강함 | `gov24-301000000130` |
| 52 | [ ] | [장애인가정 출산지원금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002249&wlfareInfoReldBztpCd=02) | 장애인가구에 출산비용을 지원함으로써 경제적 부담을 경감하고 출산 친화적 문화조성을 통한 삶의 질 개선에 기여하는 것을 목적으로 함. | 서울특별시 중구 복지환경국 어르신장애인복지과 | 복지로 | 강함 | `bokjiro-wlf00002249` |
| 53 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004434&bnefType=all&svcId=301000000124) | 중구 관내 등록장애인 중 출산 장애인가정에 출산지원금 지급 | 서울특별시 중구 | 보조금24 | 강함 | `gov24-301000000124` |
| 54 | [x] | [출산양육지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004772&bnefType=all&svcId=301000000126) | 신생아 부모에게 출산양육비 지원 | 서울특별시 중구 | 보조금24, 복지로 | 강함 | `gov24-301000000126` |
| 55 | [ ] | [장애인 휠체어 수리 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000977&wlfareInfoReldBztpCd=02) | 장애인 이동권 보장 | 서울특별시 중구 복지환경국 어르신장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000977` |
| 56 | [ ] | [저소득 주민 국민건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002252&wlfareInfoReldBztpCd=02) | 국민기초생활보장법에 의한 수급권자에 해당하지 아니한 만65세 노인세대, 등록 장애인 세대,· 한 부모 세대 등 저소득 주민들에게 국민건강보험료를… | 서울특별시 중구 복지환경국 생활보장과 | 복지로 | 후보 | `bokjiro-wlf00002252` |
| 57 | [ ] | [지역아동센터 운영지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=807488&bnefType=all&svcId=301000000139) | 지역사회 내 아동돌봄에 대한 사전 예방적 기능 및 사후 연계 제공 | 서울특별시 중구 | 보조금24 | 후보 | `gov24-301000000139` |

## 서울특별시 용산구 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 58 | [ ] | [산모·신생아 건강관리 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004360&wlfareInfoReldBztpCd=02) | - 출산가정에 건강관리사를 파견하여 산모의 산후 회복과 신생아의 양육을 지원하고, 출산가정의 경제적 부담을 경감 - 산모·신생아 건강관리사 양성… | 서울특별시 용산구 보건소 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00004360` |
| 59 | [x] | [용산구 산모신생아 건강관리 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2152520&bnefType=all&svcId=302000000125) | 산모신생아 건강관리 서비스 이용 후 본인부담금 지원 | 서울특별시 용산구 | 보조금24 | 강함 | `gov24-302000000125` |
| 60 | [x] | [임산부 건강관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001800&bnefType=all&svcId=302000000109) | ○임산부 등록, 모성검사, 태아기형아 검사, 임신성 당뇨 검사 등 제공 | 서울특별시 용산구 | 보조금24 | 강함 | `gov24-302000000109` |
| 61 | [x] | [임산부 및 배우자 백일해 예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2175820&bnefType=all&svcId=302000000126) | 임신부 및 배우자 백일해 예방접종 지원 | 서울특별시 용산구 | 보조금24 | 강함 | `gov24-302000000126` |
| 62 | [x] | [장애인가정 출산지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004938&bnefType=all&svcId=302000000112) | 출산 장애인 가정에 출산지원금 지급 | 서울특별시 용산구 | 보조금24, 복지로 | 강함 | `gov24-302000000112` |
| 63 | [ ] | [출산장려 지원사업(출산지원금 지원)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002444&wlfareInfoReldBztpCd=02) | 다자녀 가구를 중심으로 구 출산지원금 지원 기준을 개정하여 다자녀 가구의 경제적 부담을 완화하고 출산장려 분위기를 조성하고자 함 | 서울특별시 용산구 생활지원국 가족정책과 | 복지로 | 강함 | `bokjiro-wlf00002444` |
| 64 | [x] | [출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004945&bnefType=all&svcId=302000000113) | 셋째아 이상을 출산한 부모에게 출산지원금 지급 | 서울특별시 용산구 | 보조금24 | 강함 | `gov24-302000000113` |
| 65 | [ ] | [보호대상아동 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001459&bnefType=all&svcId=302000000103) | 가정위탁보호 아동 등을 대상으로 양육비, 위문금 등 지원 | 서울특별시 용산구 | 보조금24 | 후보 | `gov24-302000000103` |
| 66 | [ ] | [저소득자 및 보훈단체 지원(국가유공자 및 유족격려)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000981&wlfareInfoReldBztpCd=02) | - 국가보훈대상자에게 설, 추석, 보훈의 달에 위문금 지급(5만) - 6.25 참전유공자에게 보훈의 달에 위문금 지급(30만원) | 서울특별시 용산구 생활지원국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00000981` |

## 서울특별시 성동구 (16건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 67 | [x] | [(성동구) 난임부부 시술비 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2118901&bnefType=all&svcId=303000000311) | 난임 시술비 원외 약제비 지원 | 서울특별시 성동구 | 보조금24 | 강함 | `gov24-303000000311` |
| 68 | [ ] | [보편적 산후조리비용지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005168&wlfareInfoReldBztpCd=02) | 출산가정의 경제적 부담을 덜어주고 산모와 아기의 안정적 회복과 성장을 도와 아이 낳고 키우기 좋은 출산친화 도시 조성을 위함 | 서울특별시 성동구 보건소 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00005168` |
| 69 | [x] | [산후조리비용 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2101901&bnefType=all&svcId=303000000114) | 성동구에 거주하고 있는 출산가정에 산후조리비용을 지원함 | 서울특별시 성동구 | 보조금24 | 강함 | `gov24-303000000114` |
| 70 | [x] | [임산부 가사돌봄 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003923&wlfareInfoReldBztpCd=02) | 임산부 및 출산가정에 가사서비스를 제공함으로써 안전한 출산을 도모하고, 가사노동의 부담을 경감하고 일·가정 양립 지원 | 서울특별시 성동구 복지국 성평등가족과 | 복지로 | 강함 | `bokjiro-wlf00003923` |
| 71 | [x] | [임신부 및 배우자 백일해 예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169423&bnefType=all&svcId=303000000347) | 임신부 및 배우자 백일해 예방접종 지원 | 서울특별시 성동구 | 보조금24 | 강함 | `gov24-303000000347` |
| 72 | [x] | [출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005413&bnefType=all&svcId=303000000111) | 셋째자녀 이상 출생 가정에 출생축하금 지원 | 서울특별시 성동구 | 보조금24 | 강함 | `gov24-303000000111` |
| 73 | [ ] | [출생축하금지원사업(셋째아 이상)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002160&wlfareInfoReldBztpCd=02) | 출산율 저하와 인구노령화 등 사회문제에 적극 대처하고 출산장려 분위기 조성을 위하여 영아 출산가정에 대한 출생축하금을 지원 | 서울특별시 성동구 복지국 성평등가족과 | 복지로 | 강함 | `bokjiro-wlf00002160` |
| 74 | [x] | [성동구 미숙아 호흡기세포융합바이러스 예방접종비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006643&wlfareInfoReldBztpCd=02) | 면역력이 취약한 미숙아의 감염병(특정 치료제가 없는 4군 법정감염병)을 예방하여 질병에 따른 경제적 부담을 줄여 건강 증진을 도모하고자 함 | 서울특별시 성동구 보건소 건강관리과 | 복지로 | 후보 | `bokjiro-wlf00006643` |
| 75 | [ ] | [성동구 청년 등 탈모 치료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005234&wlfareInfoReldBztpCd=02) | 청년 등의 탈모로 인한 정신적·육제적 고통을 해소하고 자신감 넘치는 일상생활을 영위할 수 있도록 탈모 치료 지원 | 서울특별시 성동구 복지국 아동청년과 | 복지로 | 후보 | `bokjiro-wlf00005234` |
| 76 | [x] | [아픈아이 병원 동행서비스 「우리아이 안심동행센터」](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005191&wlfareInfoReldBztpCd=02) | 돌봄 취약계층 아동의 병원 동행서비스 제공을 통한 가정 내 돌봄 부담 경감 및 아동 안전 강화 | 서울특별시 성동구 복지국 아동청년과 | 복지로 | 후보 | `bokjiro-wlf00005191` |
| 77 | [ ] | [어르신 국가예방접종 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2164741&bnefType=all&svcId=303000000336) | 예방접종 지원 | 서울특별시 성동구 | 보조금24 | 후보 | `gov24-303000000336` |
| 78 | [ ] | [어린이 예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001560&bnefType=all&svcId=303000000104) | 어린이(만12세이하 구민)에게 지원백신 19종 무료 예방접종 지원(위탁의료기관 등) | 서울특별시 성동구 | 보조금24 | 후보 | `gov24-303000000104` |
| 79 | [x] | [장난감세상](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2161819&bnefType=all&svcId=303000000327) | 영유아 자녀를 둔 서울시민 대상 장난감 및 도서 대여 서비스 제공 | 서울특별시 성동구 | 보조금24 | 후보 | `gov24-303000000327` |
| 80 | [ ] | [장난감세상 운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002060&wlfareInfoReldBztpCd=02) | 영유아 자녀를 둔 가정이 장난감 및 도서대여 서비스를 무료로 이용함으로써 재정적 부담을 줄이고, 육아의 만족을 높이고자 함. | 서울특별시 성동구 복지국 성평등가족과 | 복지로 | 후보 | `bokjiro-wlf00002060` |
| 81 | [ ] | [저소득 한부모가족 지원(명절격려금, 학습참고서비)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002157&wlfareInfoReldBztpCd=02) | 저소득 한부모가족 명절격려금 및 학습참고서비를 지원하여 자녀양육 환경을 개선하고 가족기능 유지와 생활안정에 기여하고자 함 | 서울특별시 성동구 복지국 성평등가족과 | 복지로 | 후보 | `bokjiro-wlf00002157` |
| 82 | [ ] | [저소득주민 명절 위문 (기초수급자)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002159&wlfareInfoReldBztpCd=02) | 민족 고유의 명절을 맞이하여 기초생활보장수급자 세대에게 명절위문금을 전달하여 훈훈한 명절을 보낼 수 있도록 지원하고자 함 | 서울특별시 성동구 복지국 기초복지과 | 복지로 | 후보 | `bokjiro-wlf00002159` |

## 서울특별시 광진구 (16건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 83 | [x] | [임산부 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006710&bnefType=all&svcId=304000000127) | 임산부 등에게 산전관리, 엽산제 및 철분제, 유축기 대여 등 지원 | 서울특별시 광진구 | 보조금24 | 강함 | `gov24-304000000127` |
| 84 | [ ] | [입양축하금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001003&wlfareInfoReldBztpCd=02) | 보호자가 없거나 보호자로부터 이탈된 아동에게 건전한 가정을 영구적으로 제공함으로써 전인적인 성장을 지원 | 서울특별시 광진구 복지국 가정복지과 | 복지로 | 강함 | `bokjiro-wlf00001003` |
| 85 | [x] | [입양축하금 지원(구비)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001660&bnefType=all&svcId=304000000109) | 입양가정에 입양축하금 지원 | 서울특별시 광진구 | 보조금24 | 강함 | `gov24-304000000109` |
| 86 | [ ] | [장애인 특별지원(장애인 가정 출산지원금)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002664&wlfareInfoReldBztpCd=02) | o 장애인 출산지원금 : 신생아 출생일을 기준으로 1년 전부터 신청일 현재까지 계속하여 서울특별시 광진구에 주민등록을 두고 거주하는 장애인. (… | 서울특별시 광진구 복지국 장애인복지과 | 복지로 | 강함 | `bokjiro-wlf00002664` |
| 87 | [x] | [장애인가정 출산비용 지원(구비)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001585&bnefType=all&svcId=304000000102) | 장애인가정에 출산지원금 지급 | 서울특별시 광진구 | 보조금24 | 강함 | `gov24-304000000102` |
| 88 | [x] | [첫돌(출산)축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001591&bnefType=all&svcId=304000000108) | 2025. 1. 1.이후 출생아, 1년 뒤 첫돌축하금 신청. | 서울특별시 광진구 | 보조금24 | 강함 | `gov24-304000000108` |
| 89 | [ ] | [첫돌축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002667&wlfareInfoReldBztpCd=02) | 2022. 1. 1. 이후 출생한 관내 셋째아 이상 출산 가정에 축하금을 지원하여 출산을 축하하고 출산장려 분위기 조성 | 서울특별시 광진구 복지국 가정복지과 | 복지로 | 강함 | `bokjiro-wlf00002667` |
| 90 | [x] | [출생아 작명 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803294&bnefType=all&svcId=304000000141) | 관내 저소득층, 장애인, 다문화 및 2자녀이상 가정 대상 출생아 무료작명 사업 연계 | 서울특별시 광진구 | 보조금24 | 강함 | `gov24-304000000141` |
| 91 | [ ] | [(광진구)가족관계등록 상담의 날 운영](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2187117&bnefType=all&svcId=304000000243) | 국제혼인,해외출생,혼외자 출생 등 신고절차 및 나라별 구비서류 안내 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000243` |
| 92 | [x] | [광진구 장난감도서관](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803292&bnefType=all&svcId=304000000139) | 영유아 연령에 적합한 다양한 놀잇감 지원 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000139` |
| 93 | [ ] | [광진동행버스(교통약자)를 위한 무료버스 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803508&bnefType=all&svcId=304000000160) | 노약자 등 교통약자를 위한 무료버스 지원 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000160` |
| 94 | [ ] | [민원약자를 위한 원스톱 밀착 동행서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2185630&bnefType=all&svcId=304000000235) | 민원약자를 위한 「원스톱 밀착 동행 서비스」 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000235` |
| 95 | [x] | [안전카시트 대여](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803293&bnefType=all&svcId=304000000140) | 영유아 교통안전을 위한 카시트 대여 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000140` |
| 96 | [ ] | [장애인 양육지원금 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004044&wlfareInfoReldBztpCd=02) | 장애인의 양육을 지원함으로써 경제적 부담을 경감하고 장애인의 생활안정과 사회활동 참여 증진에 이바지하고자 함. | 서울특별시 광진구 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00004044` |
| 97 | [x] | [장애인가정 양육지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001588&bnefType=all&svcId=304000000105) | 자녀를 양육하는 장애인에게 양육지원금 지급 | 서울특별시 광진구 | 보조금24 | 후보 | `gov24-304000000105` |
| 98 | [ ] | [취약계층 어린이 물놀이 수영장 이용권 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005401&wlfareInfoReldBztpCd=02) | ① 제도(사업) 변경의 필요성 및 목적 □ 경제적 양극화 심화 및 불안정한 가정의 증가 01년~21년 동안 서울시의 기초생활보장수급자 가구는 약… | 서울특별시 광진구 행정국 체육진흥과 | 복지로 | 후보 | `bokjiro-wlf00005401` |

## 서울특별시 동대문구 (13건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 99 | [ ] | [동대문구 유기동물 입양비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809007&bnefType=all&svcId=305000000132) | 관내 유실,유기동물을 반려 목적의 입양 후 소요된 소유자 부담 비용 지원/1마리당 25만원 | 서울특별시 동대문구 | 보조금24 | 강함 | `gov24-305000000132` |
| 100 | [ ] | [동대문구 임산부 백일해 예방접종 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006609&wlfareInfoReldBztpCd=02) | 임신부 및 산모에게 백일해(Tdap)예방접종을 지원하여 산모와 신생아를 백일해 감염으로부터 보호하고, 안전한 출산환경을 조성하고자함. | 서울특별시 동대문구 보건소 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00006609` |
| 101 | [x] | [동대문구형 산모신생아 건강관리 본인부담금 지원 사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809723&bnefType=all&svcId=305000000136) | 산모신생아 건강관리 서비스 본인부담금의 90%를 지원 | 서울특별시 동대문구 | 보조금24 | 강함 | `gov24-305000000136` |
| 102 | [x] | [임산부 등록 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003267&bnefType=all&svcId=305000000109) | 임산부에게 당뇨 및 풍진, 유축기 대여 등 지원 | 서울특별시 동대문구 | 보조금24 | 강함 | `gov24-305000000109` |
| 103 | [x] | [임신부 백일해 예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168602&bnefType=all&svcId=305000000286) | 임신부 백일해 예방접종 지원 | 서울특별시 동대문구 | 보조금24 | 강함 | `gov24-305000000286` |
| 104 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002558&bnefType=all&svcId=305000000105) | 출산한 장애인가정에 출산지원금 지급 | 서울특별시 동대문구 | 보조금24 | 강함 | `gov24-305000000105` |
| 105 | [x] | [출생축하용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000737&bnefType=all&svcId=305000000102) | 모든 출생아를 대상으로 출생축하용품 지원 | 서울특별시 동대문구 | 보조금24, 복지로 | 강함 | `gov24-305000000102` |
| 106 | [ ] | [다자녀 입학축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002556&bnefType=all&svcId=305000000103) | 셋째자녀 이상 입학아동의 부모에게 입학축하금 지원 | 서울특별시 동대문구 | 보조금24 | 후보 | `gov24-305000000103` |
| 107 | [ ] | [다자녀가정 입학축하금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002764&wlfareInfoReldBztpCd=02) | 다자녀 입학축하금 지급으로 출산을 장려하는 사회분위기 조성 | 서울특별시 동대문구 주민복지국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00002764` |
| 108 | [x] | [동대문구 미숙아 RSV(호흡기세포융합바이러스) 예방접종비 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006487&wlfareInfoReldBztpCd=02) | RSV감염에 취약한 미숙아에 대해 예방접종비를 지원함으로써 감염병을 예방하고 미숙아 가정의 경제적 부담을 경감하기 위함 | 서울특별시 동대문구 보건소 건강관리과 | 복지로 | 후보 | `bokjiro-wlf00006487` |
| 109 | [ ] | [소아‧청소년 제1형 당뇨병 환자 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006328&wlfareInfoReldBztpCd=02) | 소아‧청소년 당뇨병 환자가 당뇨병 관리기기를 통해 지속적인 혈당 측정 및 인슐린 주입 등 일상생활에서 꾸준한 질병관리를 할 수 있도록 요양비를 … | 서울특별시 동대문구 보건소 보건행정과 | 복지로 | 후보 | `bokjiro-wlf00006328` |
| 110 | [ ] | [저소득층 아동 체험행사](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104584&bnefType=all&svcId=305000000173) | 관내 저소득층 아동을 대상으로 다양한 체험행사 실시 | 서울특별시 동대문구 | 보조금24 | 후보 | `gov24-305000000173` |
| 111 | [ ] | [첫만남이용권](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806336&bnefType=all&svcId=305000000113) | 출생아1인당 1회 200만원의 이용권 지원 | 서울특별시 동대문구 | 보조금24 | 후보 | `gov24-305000000113` |

## 서울특별시 중랑구 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 112 | [x] | [[중랑구]난임부부 약제비 지원(난임시술 이후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2117202&bnefType=all&svcId=306000000210) | 난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원 | 서울특별시 중랑구 | 보조금24 | 강함 | `gov24-306000000210` |
| 113 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001552&bnefType=all&svcId=306000000105) | 신생아를 출산한 장애인가정에 출산지원금 지급 | 서울특별시 중랑구 | 보조금24, 복지로 | 강함 | `gov24-306000000105` |
| 114 | [ ] | [중랑형 출산축하용품 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006571&wlfareInfoReldBztpCd=02) | 초저출산시대 구민들이 가장 필요로 하는 출생 가정의 경제적 부담을 완화하여 아이 낳고 키우기 좋은 도시 실현 및 출산 장려에 기여하고자 함. | 서울특별시 중랑구 생활복지국 보육지원과 | 복지로 | 강함 | `bokjiro-wlf00006571` |
| 115 | [x] | [출산축하용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2182117&bnefType=all&svcId=306000000239) | 구민 전용 출산.육아용품 온라인몰에서 필요한 물품 직접 선택 | 서울특별시 중랑구 | 보조금24 | 강함 | `gov24-306000000239` |
| 116 | [ ] | [가정위탁아동 격려품 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002794&wlfareInfoReldBztpCd=02) | 가정위탁아동이 따뜻한 이웃의 정을 느끼고 밝게 성장할 수 있도록 격려품 지원(설,추석,가정의 달,연말) 인당 문화상품권 5만원 지원 | 서울특별시 중랑구 생활복지국 아동청소년과 | 복지로 | 후보 | `bokjiro-wlf00002794` |
| 117 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2184016&bnefType=all&svcId=306000000243) | 중랑구민 출산모에게 1인 기본 4주 유축기 대여(재고상황에 따라, 1회 4주 연장 가능) | 서울특별시 중랑구 | 보조금24 | 후보 | `gov24-306000000243` |
| 118 | [x] | [장난감도서관 운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002168&wlfareInfoReldBztpCd=02) | 영유아들에게 다양한 놀잇감을 접할 수 있는 기회를 제공하고 장난감구매에 따른 경제적 부담을 경감시켜 양질의 보육환경을 제공 | 서울특별시 중랑구 생활복지국 보육지원과 | 복지로 | 후보 | `bokjiro-wlf00002168` |
| 119 | [ ] | [저소득 틈새계층 국민건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002512&wlfareInfoReldBztpCd=02) | 국민기초생활보장법상의 수급권자가 아닌, 저소득 틈새계층 중 건강보험료를 납부하지 못하여 의료사각지대에 놓인 구민들에게 국민건강보험료를 지원함으로… | 서울특별시 중랑구 생활복지국 사회복지과 | 복지로 | 후보 | `bokjiro-wlf00002512` |
| 120 | [x] | [중랑구 공동육아방 서비스 이용 안내](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2152557&bnefType=all&svcId=306000000220) | 영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영 | 서울특별시 중랑구 | 보조금24 | 후보 | `gov24-306000000220` |

## 서울특별시 성북구 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 121 | [x] | [[성북구]난임부부 약제비 지원(난임시술 이후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2114201&bnefType=all&svcId=307000000175) | 난임시술과 직접적 관련있는 원외약처방 약제비에 대해 정부지원금 한도 내에서 지원 | 서울특별시 성북구 | 보조금24 | 강함 | `gov24-307000000175` |
| 122 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003321&bnefType=all&svcId=307000000109) | 성북구에서 출산한 장애인가정에 출산지원금 지급 | 서울특별시 성북구 | 보조금24, 복지로 | 강함 | `gov24-307000000109` |
| 123 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(경로우대자)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170140&bnefType=all&svcId=307000000218) | 성북구 육아종합센터 이용시 경로우대자 이용료 및 사용료 감면(50%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000218` |
| 124 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(국가유공자)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170139&bnefType=all&svcId=307000000217) | 성북구 육아종합센터 이용시 국가유공자 이용료 및 사용료 감면(100%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000217` |
| 125 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(다둥이 행복카드 소지자)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170141&bnefType=all&svcId=307000000219) | 성북구 육아종합센터 이용시 다둥이 행복카드 소지자 이용료 및 사용료 감면(50%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000219` |
| 126 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(수급권자)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170135&bnefType=all&svcId=307000000214) | 성북구 육아종합센터 이용시 수급권자 이용료 및 사용료 감면(100%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000214` |
| 127 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(장애인)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170138&bnefType=all&svcId=307000000216) | 성북구 육아종합센터 이용시 장애인 이용료 및 사용료 감면(100% 또는 50%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000216` |
| 128 | [ ] | [성북구 육아종합센터 이용료 및 사용료 감면(한부모가족)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170136&bnefType=all&svcId=307000000215) | 성북구 육아종합센터 이용시 한부모가족 이용료 및 사용료 감면(100%) | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000215` |
| 129 | [ ] | [아동청소년 동행카드 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001577&bnefType=all&svcId=307000000105) | 13세 및 중학교 1학년에게 문화·예술·진로체험을 할 수 있는 10만 포인트 지원 | 서울특별시 성북구 | 보조금24, 복지로 | 후보 | `gov24-307000000105` |
| 130 | [ ] | [저소득구민 명절 위문금 지급 (차상위 아동·청소년 가구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004359&bnefType=all&svcId=307000000110) | 동주민센터 추천을 받은 차상위 아동·청소년 250가구에 100,000원 지급 | 서울특별시 성북구 | 보조금24 | 후보 | `gov24-307000000110` |
| 131 | [ ] | [저소득주민 위문금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004265&wlfareInfoReldBztpCd=02) | 수급자 등 저소득구민에게 필요한 명절 위문금을 지원함으로써 생활안정 및 위로를 도모함 | 서울특별시 성북구 복지교육국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00004265` |

## 서울특별시 강북구 (4건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 132 | [x] | [입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003994&bnefType=all&svcId=308000000119) | 입양한 가정에 일정 금액의 축하금 지원 | 서울특별시 강북구 | 보조금24 | 강함 | `gov24-308000000119` |
| 133 | [ ] | [강북구 아동·청소년 동행카드 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005963&wlfareInfoReldBztpCd=02) | 강북구 아동·청소년에게 다양한 문화·예술·진로체험 기회 제공을 통해 아동·청소년들이 꿈과 희망을 실현하며, 건강한 성장을 도모하도록 지원하고자 … | 서울특별시 강북구 복지국 청소년과 | 복지로 | 후보 | `bokjiro-wlf00005963` |
| 134 | [x] | [모성보건사업 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006022&bnefType=all&svcId=308000000128) | 임신부 등을 대상으로 엽산 및 철분제 지원 , 임신초기검사, 기형아(쿼드) 검사 등 지원 | 서울특별시 강북구 | 보조금24 | 후보 | `gov24-308000000128` |
| 135 | [ ] | [장애인 명절위문품 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002828&wlfareInfoReldBztpCd=02) | 지역에서 소외된 장애인들에게 명절위문품을 지급하여 명절준비에 대한 경제적 부담을 덜고자 함 | 서울특별시 강북구 복지생활국 어르신·장애인과 | 복지로 | 후보 | `bokjiro-wlf00002828` |

## 서울특별시 도봉구 (7건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 136 | [ ] | [도봉구 오!사방복지 출생축하용품 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005587&wlfareInfoReldBztpCd=02) | 자녀를 출산한 가정에 육아용품이 든 축하선물을 택배배송함으로 출산 양육 친화적인 환경 조성 | 서울특별시 도봉구 복지가족국 가족정책과 | 복지로 | 강함 | `bokjiro-wlf00005587` |
| 137 | [x] | [산모·신생아 건강관리 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004363&bnefType=all&svcId=309000000138) | 출산가정에 산모신생아 건강관리 서비스 본인부담금 지원 | 서울특별시 도봉구 | 보조금24 | 강함 | `gov24-309000000138` |
| 138 | [ ] | [산모·신생아 건강관리 지원 확대(본인부담금 지원)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001775&wlfareInfoReldBztpCd=02) | 산모신생아 건강관리 서비스를 받은 관내(도봉구 6개월 이상 주민등록된 산모) 출산가정에 본인부담금의 90%(최대 35만원)을 지급하여 산모의 산… | 서울특별시 도봉구 보건소 지역보건과 | 복지로 | 강함 | `bokjiro-wlf00001775` |
| 139 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002528&bnefType=all&svcId=309000000132) | 출산한 장애인가정에 출산지원금 지급 | 서울특별시 도봉구 | 보조금24, 복지로 | 강함 | `gov24-309000000132` |
| 140 | [x] | [출생축하용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2116618&bnefType=all&svcId=309000000282) | 출생축하용품 물품상자 택배 발송 | 서울특별시 도봉구 | 보조금24 | 강함 | `gov24-309000000282` |
| 141 | [ ] | [가정위탁아동 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001033&bnefType=all&svcId=309000000129) | 가정위탁아동들을 위해 명절 위문금 및 졸업, 입학축하금 등 지원 | 서울특별시 도봉구 | 보조금24 | 후보 | `gov24-309000000129` |
| 142 | [x] | [여성과 어린이 건강증진 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000400&bnefType=all&svcId=309000000124) | 관내 임산부를 대상으로 임신초기검사 및 기형아검사 실시, 모자건강프로그램 운영 | 서울특별시 도봉구 | 보조금24 | 후보 | `gov24-309000000124` |

## 서울특별시 노원구 (3건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 143 | [x] | [임신초기검사 및 기형아검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005850&bnefType=all&svcId=310000000122) | 임신부에게 초기검사 및 기형아 검사 지원 | 서울특별시 노원구 | 보조금24 | 강함 | `gov24-310000000122` |
| 144 | [x] | [출산 장려 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005191&bnefType=all&svcId=310000000118) | 출산 장려 등을 위한 서비스 지원 | 서울특별시 노원구 | 보조금24 | 강함 | `gov24-310000000118` |
| 145 | [ ] | [아동복지시설 만기퇴소 청소년 자립정착금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000229&bnefType=all&svcId=310000000101) | 시설 및 가정위탁 보호종료아동 지원 | 서울특별시 노원구 | 보조금24 | 후보 | `gov24-310000000101` |

## 서울특별시 은평구 (20건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 146 | [x] | [다자녀 출산용품 교환권 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005551&bnefType=all&svcId=311000000117) | 은평구 둘째 이상 출산가정에 15만원 출산용품교환권 지원 | 서울특별시 은평구 | 보조금24 | 강함 | `gov24-311000000117` |
| 147 | [x] | [셋째아가정 산후건강관리 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100615&bnefType=all&svcId=311000000139) | 셋째아 이상 출산 가정 중 산모신생아 건강관리 서비스 본인부담금 90% 지원 | 서울특별시 은평구 | 보조금24, 복지로 | 강함 | `gov24-311000000139` |
| 148 | [x] | [은평구 한방 난임 치료지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006326&wlfareInfoReldBztpCd=02) | 난임부부 및 개인을 대상으로 한의약적 접근을 통해 월경불순, 배란장애 등 생식 기능 개선 뿐 아니라 체계적인 임신 준비로 건강한 임신, 출산에 … | 서울특별시 은평구 보건소 예방관리과 | 복지로 | 강함 | `bokjiro-wlf00006326` |
| 149 | [x] | [임산부 등록관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003277&bnefType=all&svcId=311000000113) | 임신부에게 엽산제, 철분제, 기형아 검사 지원 | 서울특별시 은평구 | 보조금24 | 강함 | `gov24-311000000113` |
| 150 | [x] | [임산부 및 영유아가정 아이맘택시](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100704&bnefType=all&svcId=311000000137) | 관내 임산부 및 영유아가정(0~24개월)이 병의원방문시 전용택시를 통한 이동서비스 지원 | 서울특별시 은평구 | 보조금24 | 강함 | `gov24-311000000137` |
| 151 | [x] | [입양아동 입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100625&bnefType=all&svcId=311000000144) | 입양아동 입양축하금 지원 | 서울특별시 은평구 | 보조금24 | 강함 | `gov24-311000000144` |
| 152 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001477&bnefType=all&svcId=311000000106) | 출산한 장애인가정에 출산지원금 지급 | 서울특별시 은평구 | 보조금24, 복지로 | 강함 | `gov24-311000000106` |
| 153 | [ ] | [출산지원 사업(다자녀 출산용품교환권)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002207&wlfareInfoReldBztpCd=02) | 저출산 및 인구의 고령화에 따른 사회구조 변화에 대응하기 위해 둘째아 이상 출산가정에 출산용품 교환권 지급 | 서울특별시 은평구 교육문화국 가족정책과 | 복지로 | 강함 | `bokjiro-wlf00002207` |
| 154 | [ ] | [가정위탁아동 보호지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100622&bnefType=all&svcId=311000000143) | 가정위탁아동 지원 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000143` |
| 155 | [ ] | [공동육아나눔터 운영](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2101304&bnefType=all&svcId=311000000151) | 자녀들이 안전한 실내 공간에서 장난감과 도서를 마음껏 이용하는 놀이공간을 제공하고 부모들이 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000151` |
| 156 | [ ] | [보호대상아동 축하·위문금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004954&bnefType=all&svcId=311000000116) | 보호대상아동을 위해 연말위문금 등 지원 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000116` |
| 157 | [x] | [부모성장을 위한 심리지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100614&bnefType=all&svcId=311000000138) | 전문 심리상담을 통하여 임신과 출산, 자녀 양육에 따른 심리·정서적 부담을 완화 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000138` |
| 158 | [ ] | [서울시 저소득 중증장애인 전세주택 제공사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002109&wlfareInfoReldBztpCd=02) | 저소득 중증장애인이 월세 부담에서 벗어나 전세주택에 입주할 수 있도록 최장 6년간 무상으로 전세보증금을 지원하여 주거환경 개선 및 지역사회 자립… | 서울특별시 은평구 주민복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00002109` |
| 159 | [ ] | [아동보호조치를 위한 심리·건강 검진 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001483&bnefType=all&svcId=311000000112) | 보호대상아동을 위한 심리 및 건강검진 지원 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000112` |
| 160 | [ ] | [아동청소년 심리지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100603&bnefType=all&svcId=311000000134) | 심리상담, 언어, 놀이심리(상담), 인지학습, 미술·음악심리(상담), 감각통합, 심리운동 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000134` |
| 161 | [x] | [유축기 대여](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100710&bnefType=all&svcId=311000000140) | 은평구에 주소지를 둔 임산부 대상으로 유축기 대여 서비스 제공 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000140` |
| 162 | [ ] | [은평구 드림스타트](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100505&bnefType=all&svcId=311000000133) | 신체/건강, 인지/언어, 정서/행동, 부모/가족 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000133` |
| 163 | [x] | [장난감나라](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2100504&bnefType=all&svcId=311000000132) | 관내 영유아 가정에 연간 회원제로 장난감 및 도서 대여 서비스와 자유놀이실 운영 | 서울특별시 은평구 | 보조금24 | 후보 | `gov24-311000000132` |
| 164 | [ ] | [저소득 중증장애인가구 유료방송 이용요금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000666&wlfareInfoReldBztpCd=02) | 저소득 장애인가구에 다양한 방송 콘텐츠 및 문화 정보를 제공 | 서울특별시 은평구 주민복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000666` |
| 165 | [ ] | [저소득주민 국민건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002112&wlfareInfoReldBztpCd=02) | 생활에 어려움을 겪고 있으나, 수급권자에 해당되지 않는 저소득 주민에게 건강보험료를 지원함으로써 건강증진과 사회복지 향상을 목적으로 함. | 서울특별시 은평구 돌봄복지국 통합돌봄과 | 복지로 | 후보 | `bokjiro-wlf00002112` |

## 서울특별시 서대문구 (12건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 166 | [x] | [(서대문구)난임부부 지원(시술 후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2122103&bnefType=all&svcId=312000000318) | 난임시술관련 약제비 지원 | 서울특별시 서대문구 | 보조금24 | 강함 | `gov24-312000000318` |
| 167 | [ ] | [모든 임산부 임신축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005630&wlfareInfoReldBztpCd=02) | 임신한 대상자에게 임신축하금을 지급함으로써 출산장려 분위기 조성하여 출산율 향상에 기여 | 서울특별시 서대문구 보건소 지역건강과 | 복지로 | 강함 | `bokjiro-wlf00005630` |
| 168 | [x] | [서대문구 공공산후조리원 이용료 감면](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005633&wlfareInfoReldBztpCd=02) | 공공산후조리원 이용자 맞춤형 산후조리서비스 제공 공공산후조리원 이용 구민의 감면율 확대 추진으로 주민 혜택 강화 | 서울특별시 서대문구 보건소 지역건강과 | 복지로 | 강함 | `bokjiro-wlf00005633` |
| 169 | [x] | [임신축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2108203&bnefType=all&svcId=312000000125) | 출산예정일 1년 전부터 현재까지 계속하여 서대문구에 주민등록을 두고 실제 거주 임신부지원 | 서울특별시 서대문구 | 보조금24 | 강함 | `gov24-312000000125` |
| 170 | [x] | [입양가정 입양축하금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000532&bnefType=all&svcId=312000000105) | 아동을 국내입양한 가정 중 가정법원 입양 확정일이 22. 1.1. 이후인 가정 | 서울특별시 서대문구 | 보조금24 | 강함 | `gov24-312000000105` |
| 171 | [ ] | [입양가정 입양축하금(입양장려금) 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004281&wlfareInfoReldBztpCd=02) | 보호대상아동을 입양한 가정을 지원하여 국내입양을 활성화하고 보호가 필요한 아동과 지역사회의 결연을 강화코자 함 | 서울특별시 서대문구 교육문화체육국 아동청소년과 | 복지로 | 강함 | `bokjiro-wlf00004281` |
| 172 | [ ] | [다자녀가족 둘째아 이상 초등학교 입학축하상품권 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001646&bnefType=all&svcId=312000000107) | 초등학교 입학하는 둘째 10만원, 셋째 이상 아동에게 20만원 상당 서대문사랑상품권 지급 | 서울특별시 서대문구 | 보조금24 | 후보 | `gov24-312000000107` |
| 173 | [ ] | [서대문구 다자녀가족 입학축하상품권 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005646&wlfareInfoReldBztpCd=02) | 둘째아 이상 다자녀가정이 초등학교 입학 시 입학축하상품권을 지급하여 경제적 부담을 덜고 양육친화적인 환경을 조성하고자 하는 사업입니다. | 서울특별시 서대문구 복지문화체육국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00005646` |
| 174 | [x] | [서대문구 아빠 육아휴직장려금](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2116102&bnefType=all&svcId=312000000315) | 서대문구 1년 이상 거주 고용노동부 육아휴직급여 수급 아빠께 장려금 30만원 지원합니다 | 서울특별시 서대문구 | 보조금24, 복지로 | 후보 | `gov24-312000000315` |
| 175 | [ ] | [장애인 및 가족치료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005067&bnefType=all&svcId=312000000117) | 장애인 및 가족을 대상으로 재활치료, 양육코칭 등 서비스 제공 | 서울특별시 서대문구 | 보조금24 | 후보 | `gov24-312000000117` |
| 176 | [x] | [장애인 양육비용 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006234&bnefType=all&svcId=312000000123) | 장애인을 대상으로 양육비 지원 | 서울특별시 서대문구 | 보조금24 | 후보 | `gov24-312000000123` |
| 177 | [ ] | [저소득 한부모가족 명절위문금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002602&wlfareInfoReldBztpCd=02) | 저소득 한부모가족의 최저생활 수준 충족을 위해 법정급여 외 명절(설, 추석)위문금 지급 | 서울특별시 서대문구 복지문화체육국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00002602` |

## 서울특별시 마포구 (8건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 178 | [x] | [(마포구)난임부부 시술비 약제비 지원(시술 후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2147216&bnefType=all&svcId=313000000131) | 난임시술 관련 약제비 지원 | 서울특별시 마포구 | 보조금24 | 강함 | `gov24-313000000131` |
| 179 | [x] | [임산부 건강관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000480&bnefType=all&svcId=313000000102) | 임산부에게 엽산제 및 철분제 지원, 임신초기 검사, 유축기 대여 등 | 서울특별시 마포구 | 보조금24 | 강함 | `gov24-313000000102` |
| 180 | [x] | [입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2150230&bnefType=all&svcId=313000000161) | 입양아동 1명당 입양축하금 200만원 지원(장애 입양아동, 비장애 입양아동 동일) | 서울특별시 마포구 | 보조금24 | 강함 | `gov24-313000000161` |
| 181 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002510&bnefType=all&svcId=313000000108) | 자녀를 출산한 장애인가정에 출산지원금 지원 | 서울특별시 마포구 | 보조금24 | 강함 | `gov24-313000000108` |
| 182 | [ ] | [철분제,엽산제 구매(임산부 및 영유아관리)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004358&wlfareInfoReldBztpCd=02) | 태아의 신경관결손과 임산부의 철분결핍성 빈혈로 발생할 수 있는 유산, 사산, 조산, 산모사망을 예방하기 위해 엽산제와 철분제를 지원하여 안전한 … | 서울특별시 마포구 보건소 건강동행과 | 복지로 | 강함 | `bokjiro-wlf00004358` |
| 183 | [x] | [미혼모부 양육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000935&bnefType=all&svcId=313000000103) | 미혼모부에게 아동양육비 지원 | 서울특별시 마포구 | 보조금24 | 후보 | `gov24-313000000103` |
| 184 | [ ] | [아동 예술멘토링 지원서비스(지역사회서비스투자사업)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2149823&bnefType=all&svcId=313000000159) | 예술교육을 통한 정서발달지원, 심리발달검사, 문화예술체험학습 등을 제공 | 서울특별시 마포구 | 보조금24 | 후보 | `gov24-313000000159` |
| 185 | [x] | [장애인가정 양육지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2142722&bnefType=all&svcId=313000000129) | 마포구에 거주하는 2세이상 7세 미만 자녀를 양육하고 있는 장애인가정에 매월 10만원 지 | 서울특별시 마포구 | 보조금24 | 후보 | `gov24-313000000129` |

## 서울특별시 양천구 (4건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 186 | [x] | [양천구 장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001749&bnefType=all&svcId=314000000111) | 출산 장애인가정에 출산지원금 지급 | 서울특별시 양천구 | 보조금24 | 강함 | `gov24-314000000111` |
| 187 | [x] | [양천구 미숙아 RSV 예방접종비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2164747&bnefType=all&svcId=314000000273) | 36주 미만 미숙아 대상 RSV 예방접종 주사료(본인부담금) 전액 지원 | 서울특별시 양천구 | 보조금24 | 후보 | `gov24-314000000273` |
| 188 | [x] | [양천형 밤샘 긴급돌봄 어린이집 운영](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165716&bnefType=all&svcId=314000000272) | 야간에도 긴급하게 보육수요 발생시 공백 없는 보육서비스 제공 | 서울특별시 양천구 | 보조금24 | 후보 | `gov24-314000000272` |
| 189 | [ ] | [저소득층 아동학습지 무료지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000726&wlfareInfoReldBztpCd=02) | 가정경제의 곤란과 가정해체 등으로 교육기회를제대로 받지 못하는 저소득층 가정의 자녀를 대상으로 『HOME-STUDY&CARE』를 실시하여 아동들… | 서울특별시 양천구 주민복지국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00000726` |

## 서울특별시 강서구 (7건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 190 | [x] | [(강서구)난임부부 지원(시술 후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169516&bnefType=all&svcId=315000000288) | 난임시술관련 약제비 지원 | 서울특별시 강서구 | 보조금24 | 강함 | `gov24-315000000288` |
| 191 | [x] | [(강서구)임산부 건강관리 서비스 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168584&bnefType=all&svcId=315000000285) | 임산부에게 엽산제, 철분제, 임신초기검사, 기형아검사, 당뇨검사, 유축기 대여 등 지원 | 서울특별시 강서구 | 보조금24 | 강함 | `gov24-315000000285` |
| 192 | [x] | [강서구 임신부 가사돌봄서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2138116&bnefType=all&svcId=315000000278) | 강서구 거주 임신부(임신판정~ 출산전) 가구에 기본 가사서비스 및 병원동행서비스 지원 | 서울특별시 강서구 | 보조금24 | 강함 | `gov24-315000000278` |
| 193 | [x] | [미혼모·부 양육지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806439&bnefType=all&svcId=315000000114) | 미혼모부 만5세 이하 아동 양육 가구에 아동양육비·냉난방비 지원, 미혼모 임신출산비 지원 | 서울특별시 강서구 | 보조금24, 복지로 | 강함 | `gov24-315000000114` |
| 194 | [x] | [입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005952&bnefType=all&svcId=315000000112) | 아동입양 가정에 입양축하금 지원 | 서울특별시 강서구 | 보조금24, 복지로 | 강함 | `gov24-315000000112` |
| 195 | [x] | [강서구 다자녀가정 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005826&bnefType=all&svcId=315000000111) | 5세 이하 셋째아 이상 양육 가정에 의료비 지원 | 서울특별시 강서구 | 보조금24 | 후보 | `gov24-315000000111` |
| 196 | [ ] | [학대피해아동 심리검사 및 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006538&bnefType=all&svcId=315000000113) | 학대피해아동에 대한 치료비용, 심리치료 및 검사비용 | 서울특별시 강서구 | 보조금24 | 후보 | `gov24-315000000113` |

## 서울특별시 구로구 (14건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 197 | [x] | [(구로구)난임부부 지원(시술 후 원외약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2101303&bnefType=all&svcId=316000000124) | 난임시술관련 약제비 지원 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000124` |
| 198 | [ ] | [[구로구](보건복지부)영유아 발달 정밀검사비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2138916&bnefType=all&svcId=316000000129) | 영유아 발달 정밀검사비 지원 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000129` |
| 199 | [x] | [구로구 입양가정 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005503&wlfareInfoReldBztpCd=02) | 입양 가정에 초기 비용을 지원하여 입양 가정의 경제적 부담 경감 및 입양아동의 초기 가정 적응 지원 | 서울특별시 구로구 복지지원국 아동청소년과 | 복지로 | 강함 | `bokjiro-wlf00005503` |
| 200 | [x] | [구로형 산후조리비용 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2164749&bnefType=all&svcId=316000000136) | 기준중위소득 80%이하 출산가정에 모바일 구로사랑상품권 50만원 지급 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000136` |
| 201 | [x] | [다자녀 출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2152017&bnefType=all&svcId=316000000131) | 셋째자녀 이상 출생 가정에 출생축하금 지원 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000131` |
| 202 | [x] | [입양축하금 지급(비장애아동)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166719&bnefType=all&svcId=316000000139) | 입양자에게 입양 시 축하금 지급 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000139` |
| 203 | [x] | [입양축하금 지급(장애아동)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166720&bnefType=all&svcId=316000000140) | 장애아동 입양자에게 입양 시 축하금 지급 | 서울특별시 구로구 | 보조금24 | 강함 | `gov24-316000000140` |
| 204 | [ ] | [출생축하금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002722&wlfareInfoReldBztpCd=02) | 구로구 거주 6개월 이상 출산가정 셋째 60만원, 넷째이상 200만원 지원 (2022년부터 첫만남이용권 지급으로 출생축하금 중단하였으나 2024… | 서울특별시 구로구 복지지원국 가족보육과 | 복지로 | 강함 | `bokjiro-wlf00002722` |
| 205 | [x] | [[구로구] 찾아가는 구로맘 수유 온 지원 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170418&bnefType=all&svcId=316000000160) | 출산 후 60일 이내 산모를 대상으로 가정 방문 모유수유 촉진 관리 서비스를 제공 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000160` |
| 206 | [ ] | [구로형 심리치료비](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166721&bnefType=all&svcId=316000000141) | 1회 검사비 300,000원 치료비 : 월 최대 200,000원 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000141` |
| 207 | [x] | [누리과정 차액보육료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000039&bnefType=all&svcId=316000000101) | 기관보육료 지원 어린이집 이용아동을 위해 누리과정 차액보육료 지원 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000101` |
| 208 | [ ] | [아동·청소년 심리지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168017&bnefType=all&svcId=316000000153) | 아동·청소년에게 심리상담, 언어프로그램 등 서비스 지원 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000153` |
| 209 | [ ] | [자치회관 수강료 감면 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166920&bnefType=all&svcId=316000000148) | 자치회관 수강료 감면 지원 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000148` |
| 210 | [ ] | [학대피해아동 심리검사 및 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2167023&bnefType=all&svcId=316000000147) | 학대피해아동 및 학대행위자, 가족구성원에 대한 심리검사 심리치료비를 지원하여 재학대 방지 | 서울특별시 구로구 | 보조금24 | 후보 | `gov24-316000000147` |

## 서울특별시 금천구 (7건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 211 | [x] | [국내 입양가정 입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003757&bnefType=all&svcId=317000000111) | 입양부모에게 입양축하금 지원 | 서울특별시 금천구 | 보조금24 | 강함 | `gov24-317000000111` |
| 212 | [ ] | [금천구 입양축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002797&wlfareInfoReldBztpCd=02) | 국내입양 활성화에 기여 | 서울특별시 금천구 복지가족국 아동청소년과 | 복지로 | 강함 | `bokjiro-wlf00002797` |
| 213 | [x] | [금천구 출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001790&bnefType=all&svcId=317000000106) | 관내 1년 이상 거주하고, 셋째아 이상 출산한 다자녀 가정에 출산축하금 지급 | 서울특별시 금천구 | 보조금24, 복지로 | 강함 | `gov24-317000000106` |
| 214 | [ ] | [가정위탁아동 격려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000830&bnefType=all&svcId=317000000102) | 가정위탁보호가구에 명절(설,추석),어린이날 격려금 지원 | 서울특별시 금천구 | 보조금24 | 후보 | `gov24-317000000102` |
| 215 | [ ] | [가정위탁아동 생일축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001784&bnefType=all&svcId=317000000105) | 가정위탁보호 아동을 위해 생일축하금 지원 | 서울특별시 금천구 | 보조금24 | 후보 | `gov24-317000000105` |
| 216 | [ ] | [금천구 금천아이성장지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2132516&bnefType=all&svcId=317000000367) | 연 1회 금천아이성장지원금 (금천G밸리사랑상품권) 10만원 지원 | 서울특별시 금천구 | 보조금24 | 후보 | `gov24-317000000367` |
| 217 | [ ] | [한부모가족 명절 격려금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000767&wlfareInfoReldBztpCd=02) | 저소득한부모가족에 명절격려금을 지급하여 경제적 부담감 경감 | 서울특별시 금천구 복지가족국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00000767` |

## 서울특별시 영등포구 (3건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 218 | [ ] | [유실·유기동물 입양비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170438&bnefType=all&svcId=318000000432) | 영등포구 지정 동물보호센터의 유실·유기동물 입양시 소유자 부담비용 지원(최대 15만원) | 서울특별시 영등포구 | 보조금24 | 강함 | `gov24-318000000432` |
| 219 | [x] | [장애인가정 출산지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000539&bnefType=all&svcId=318000000101) | 출산한 장애인가정에 출산지원금 지급 | 서울특별시 영등포구 | 보조금24 | 강함 | `gov24-318000000101` |
| 220 | [x] | [장애인가정 양육지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2142329&bnefType=all&svcId=318000000401) | 장애인가정 양육지원금 지원 | 서울특별시 영등포구 | 보조금24 | 후보 | `gov24-318000000401` |

## 서울특별시 동작구 (20건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 221 | [x] | [동작구 산모신생아 건강관리 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2120919&bnefType=all&svcId=319000000162) | 산모신생아 건강관리 지원서비스 본인부담금 90% 지원 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000162` |
| 222 | [x] | [동작구 신생아 상해,질병 보험료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2107907&bnefType=all&svcId=319000000142) | 신생아에게 빈번히 발생하는 질병의 외래진료비, 치료비를 보장하는 보장성 보험료 5년간 지원 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000142` |
| 223 | [x] | [동작구 출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005778&bnefType=all&svcId=319000000124) | 동작구에 거주하는 출생아 부모에게 출산축하금 지원 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000124` |
| 224 | [x] | [동작구 출산축하용품 구입비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2124901&bnefType=all&svcId=319000000164) | 동작구에 거주하는 출생아 부모에게 출산축하용품 구입비 지원 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000164` |
| 225 | [ ] | [동작출산축하금 및 출산축하용품](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002628&wlfareInfoReldBztpCd=02) | 사회문제인 출산율 감소에 적극 대처하고 출산장려 분위기 조성 | 서울특별시 동작구 복지국 영유아보육과 | 복지로 | 강함 | `bokjiro-wlf00002628` |
| 226 | [ ] | [미혼모부 양육비 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003949&wlfareInfoReldBztpCd=02) | 자녀를 직접 양육하는 미혼모부에게 우리구만의 특화된 사업으로 경제적 부담을 줄이고 자립할 수 있도록 지원하고자 함 | 서울특별시 동작구 미래교육국 영유아보육과 | 복지로 | 강함 | `bokjiro-wlf00003949` |
| 227 | [ ] | [신생아 건강보험료 지원(둘째이상 신생아 상해질병 보험료 지원)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002626&wlfareInfoReldBztpCd=02) | 불의의 질병, 사고로 인한 다자녀 가정의 경제적 비용을 경감함으로써 저출산 문제를 극복하고 영유아의 건강한 양육을 위한 사회 환경 조성 | 서울특별시 동작구 복지국 영유아보육과 | 복지로 | 강함 | `bokjiro-wlf00002626` |
| 228 | [ ] | [유실·유기동물 입양비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809770&bnefType=all&svcId=319000000136) | 동작구 지정 동물보호센터에서 유기동물을 반려의 목적으로 입양한 자에게 입양비 지원 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000136` |
| 229 | [x] | [임산부 친환경농산물 꾸러미 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2113512&bnefType=all&svcId=319000000145) | 1인당 24만원(자부담 4만8천원 포함) 상당 친환경농산물 꾸러미 공급 | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000145` |
| 230 | [x] | [입양가정 입양장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003323&bnefType=all&svcId=319000000113) | 동작구 신규 입양가정의 경제적 부담 완화를 위해 동작구가 입양장려금을 지원합니다. | 서울특별시 동작구 | 보조금24 | 강함 | `gov24-319000000113` |
| 231 | [ ] | [교통약자 무료셔틀버스(동작복지카) 운영](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2113213&bnefType=all&svcId=319000000144) | 교통약자(어르신, 장애인, 임산부 등) 무료셔틀버스 운영(5개 노선 총 9대 운행) | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000144` |
| 232 | [x] | [동작구 미혼모부 아동양육비 등 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002663&bnefType=all&svcId=319000000111) | 만 5세 이하 아동양육 미혼모부에게 아동양육비 지급 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000111` |
| 233 | [ ] | [동작구 여성 HPV 검사비 지원 참여신청](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2171518&bnefType=all&svcId=319000000190) | (동작구) 여성 HPV 검사비 3만원 한도내 지원 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000190` |
| 234 | [x] | [부모성장을 위한 심리지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004268&bnefType=all&svcId=319000000117) | 임신부 또는 만18세 이하 자녀를 둔 부모를 대상으로 심리지원서비스 제공 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000117` |
| 235 | [ ] | [아동·청소년 심리지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005031&bnefType=all&svcId=319000000121) | 아동·청소년에게 심리상담, 언어프로그램 등 서비스 지원 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000121` |
| 236 | [ ] | [아동·청소년 정서발달지원서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003556&bnefType=all&svcId=319000000115) | 아동·청소년에게 악기교육 및 예술심리치료 서비스 지원 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000115` |
| 237 | [ ] | [아동학대 피해아동 응급의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002364&bnefType=all&svcId=319000000105) | 학대 피해아동을 위해 응급의료비 지원 아동학대의심 신고건에 대한 피해아동 응급의료비지원 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000105` |
| 238 | [ ] | [자체 예방접종](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005243&bnefType=all&svcId=319000000122) | 보건소 유료 예방접종, 동작구 기초생활수급자 등 취약계층 무료 인플루엔자 접종 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000122` |
| 239 | [ ] | [저소득층 명절 위문품비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005707&bnefType=all&svcId=319000000123) | 기초 생계, 의료급여 수급자 가구에 명절 위문품비 지원 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000123` |
| 240 | [ ] | [첫만남이용권지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806444&bnefType=all&svcId=319000000130) | 주민등록번호를 부여받은 출생아에게 첫째아 200만원, 둘째아 이상 300만원 첫만남이용권 | 서울특별시 동작구 | 보조금24 | 후보 | `gov24-319000000130` |

## 서울특별시 관악구 (15건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 241 | [x] | [(관악구) 난임부부시술 약제비 지원 (시술 후 원외 약제비 신청)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2117121&bnefType=all&svcId=320000000295) | 난임시술과 직접 관련이 있는 원외약 처방을 받은 경우 정부지원금액 한도 내 약제비 지원 | 서울특별시 관악구 | 보조금24 | 강함 | `gov24-320000000295` |
| 242 | [x] | [관악구 국내 입양가정 입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2182617&bnefType=all&svcId=320000000318) | 「국내입양에 관한 특별법」에 따라 아동을 입양한 가정에 입양축하금 지원 | 서울특별시 관악구 | 보조금24 | 강함 | `gov24-320000000318` |
| 243 | [ ] | [관악구 유기동물 입양비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2181016&bnefType=all&svcId=320000000313) | 입양동물 1마리당 최대 25만원 이내 지원 | 서울특별시 관악구 | 보조금24 | 강함 | `gov24-320000000313` |
| 244 | [x] | [관악구 출생축하용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2126705&bnefType=all&svcId=320000000302) | 출생축하용품 지원(연도별 구성품목 변경) - 2026년 축하용품: 영유아 완구 세트 | 서울특별시 관악구 | 보조금24, 복지로 | 강함 | `gov24-320000000302` |
| 245 | [x] | [관악구 한의약 난임치료 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006656&wlfareInfoReldBztpCd=02) | 자연임신을 원하는 원인불명의 난임부부를 위한 첩약 치료비용 지원 | 서울특별시 관악구 보건소 지역보건과 | 복지로 | 강함 | `bokjiro-wlf00006656` |
| 246 | [x] | [임산부 서비스 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001493&bnefType=all&svcId=320000000105) | 임산부 건강관리 서비스 제공 | 서울특별시 관악구 | 보조금24 | 강함 | `gov24-320000000105` |
| 247 | [x] | [관악구 깡충깡충 성장양육지원금](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2123426&bnefType=all&svcId=320000000299) | 해당연령 각 1회 관악사랑상품권 30만원 지원 | 서울특별시 관악구 | 보조금24, 복지로 | 후보 | `gov24-320000000299` |
| 248 | [x] | [관악구 장애인가정 양육지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2110214&bnefType=all&svcId=320000000116) | 장애인가정 양육지원금 지급 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000116` |
| 249 | [ ] | [국가유공자 인플루엔자 백신 및 접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166918&bnefType=all&svcId=320000000311) | 국가유공자 인플루엔자 예방접종 지원 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000311` |
| 250 | [ ] | [기초생활수급자 명절위문금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=810026&bnefType=all&svcId=320000000112) | ○ 기초생활수급자(생계·의료) 명절위문품비 지급 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000112` |
| 251 | [ ] | [예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000814&bnefType=all&svcId=320000000101) | 국가예방접종대상자 예방접종 지원 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000101` |
| 252 | [ ] | [장애인 양육지원금 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004726&wlfareInfoReldBztpCd=02) | 자녀의 양육에 경제적·사회적으로 어려움을 겪고 있는 장애인 가족에게 양육지원금을 정기적으로 지급함으로써 장애인의 자녀 양육과 안정적인 가족생활 … | 서울특별시 관악구 복지가족국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00004726` |
| 253 | [ ] | [장애인 인플루엔자 백신 및 접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166917&bnefType=all&svcId=320000000310) | 장애인 인플루엔자 예방접종 지원 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000310` |
| 254 | [ ] | [장애인이동기기 수리비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002753&wlfareInfoReldBztpCd=02) | 장애인이 이동기기를 편리하고 안전하게 이용할 수 있도록 수동·전동 휠체어와 전동스쿠터의 수리비용을 지원합니다. | 서울특별시 관악구 복지가족국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00002753` |
| 255 | [ ] | [취약계층 인플루엔자 백신 및 접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005836&bnefType=all&svcId=320000000110) | 취약계층 인플루엔자 예방접종 지원 | 서울특별시 관악구 | 보조금24 | 후보 | `gov24-320000000110` |

## 서울특별시 서초구 (15건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 256 | [ ] | [서초구 입양아동 양육보조금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001754&bnefType=all&svcId=321000000108) | 입양아동의 양육보조금 지원 | 서울특별시 서초구 | 보조금24 | 강함 | `gov24-321000000108` |
| 257 | [x] | [임산부 영유아 등록관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005683&bnefType=all&svcId=321000000126) | 임산부에게 영양제, 산전검사, 유축기 대여 등 지원 | 서울특별시 서초구 | 보조금24 | 강함 | `gov24-321000000126` |
| 258 | [x] | [다자녀가정 실내바닥매트 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806027&bnefType=all&svcId=321000000131) | ○다자녀가정 실내바닥매트 지원 | 서울특별시 서초구 | 보조금24, 복지로 | 후보 | `gov24-321000000131` |
| 259 | [x] | [미취학아동 구강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001757&bnefType=all&svcId=321000000111) | 미취학아동을 대상으로 불소도포 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000111` |
| 260 | [ ] | [보호종료아동 생활보조수당](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004254&wlfareInfoReldBztpCd=02) | 자립준비청년 생활비 지원으로 생활안정 지원 및 자립의지 고취 | 서울특별시 서초구 밝은미래국 아동청년과 | 복지로 | 후보 | `bokjiro-wlf00004254` |
| 261 | [ ] | [부랑인 노숙인 관리지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000796&wlfareInfoReldBztpCd=02) | - 부랑인 및 노숙인에 대한 생활안정 및 자립기반 조성으로 부랑인 귀향 및 조속한 사회복귀 지원 | 서울특별시 서초구 주민생활국 사회복지과 | 복지로 | 후보 | `bokjiro-wlf00000796` |
| 262 | [ ] | [서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 교육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003274&bnefType=all&svcId=321000000115) | 자립준비청년에게 대학등록금 및 학원비 등 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000115` |
| 263 | [ ] | [서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 생활보조수당 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003268&bnefType=all&svcId=321000000114) | 자립준비청년에게 생활보조수당 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000114` |
| 264 | [ ] | [서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 자립정착금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004616&bnefType=all&svcId=321000000121) | 자립준비청년에게 자립정착금 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000121` |
| 265 | [ ] | [서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 자립컨설팅 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005151&bnefType=all&svcId=321000000123) | 자립준비청년을 대상으로 자립컨설팅 및 전화 모니터링 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000123` |
| 266 | [x] | [서초 아이돌보미·손주돌보미·119아이돌보미 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000146&bnefType=all&svcId=321000000102) | 자녀 양육가정에 아이돌보미 파견 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000102` |
| 267 | [ ] | [서초구 가정위탁아동 양육보조금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000217&bnefType=all&svcId=321000000103) | 가정위탁아동의 양육보조금 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000103` |
| 268 | [x] | [아빠육아 휴직 장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001753&bnefType=all&svcId=321000000107) | 육아휴직 중인 남성근로자에게 육아휴직장려금 지원 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000107` |
| 269 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2187116&bnefType=all&svcId=321000000146) | 유축기 대여 지원 서비스로 모유수유 권장 환경 조성 | 서울특별시 서초구 | 보조금24 | 후보 | `gov24-321000000146` |
| 270 | [ ] | [저소득 한부모가정 위문 격려(설날 및 추석)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000816&wlfareInfoReldBztpCd=02) | 추석 설 명절을 맞이하여 우리구 저소득 한부모가족을 격려함으로써 소외되기쉬운 이들이 따뜻하고 훈훈한 명절을 보낼 수 있도록 하고자 함 | 서울특별시 서초구 주민생활국 여성보육과 | 복지로 | 후보 | `bokjiro-wlf00000816` |

## 서울특별시 강남구 (13건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 271 | [x] | [강남구 산후건강관리비용 지원사업(본인부담금 환급)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001448&bnefType=all&svcId=322000000107) | 산모신생아 건강관리 바우처 이용이 끝난 출산가정에 본인부담금 지원 | 서울특별시 강남구 | 보조금24 | 강함 | `gov24-322000000107` |
| 272 | [ ] | [강남구 영유아 발달 정밀검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2153337&bnefType=all&svcId=322000000124) | 영유아 건강 관리를 위한 발달 정밀검사비 지원 | 서울특별시 강남구 | 보조금24 | 강함 | `gov24-322000000124` |
| 273 | [x] | [남성 난임 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001751&bnefType=all&svcId=322000000108) | 난임부부 중 남성에게 검진 비용 지원 | 서울특별시 강남구 | 보조금24 | 강함 | `gov24-322000000108` |
| 274 | [ ] | [산후건강관리비용 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002497&wlfareInfoReldBztpCd=02) | 산모 및 신생아의 건강관리를 증진하고 출산 가정의 경제적 부담을 덜어주기 위하여 산후건강관리비용을 지원함 | 서울특별시 강남구 보건소 건강관리과 | 복지로 | 강함 | `bokjiro-wlf00002497` |
| 275 | [x] | [입양 및 가정위탁아동 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004460&bnefType=all&svcId=322000000113) | 입양 및 가정위탁아동을 위해 양육수당, 의료비, 위문비 등을 지원 | 서울특별시 강남구 | 보조금24 | 강함 | `gov24-322000000113` |
| 276 | [ ] | [입양아동 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000817&wlfareInfoReldBztpCd=02) | 아동의 건강한 성장 및 국내입양 활성화를 위하여 입양아동 및 입양가정에 경제적 지원을 실시함으로써 보호대상 아동이 안정적인 가정환경에서 성장하도… | 서울특별시 강남구 복지생활국 가족정책과 | 복지로 | 강함 | `bokjiro-wlf00000817` |
| 277 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005801&bnefType=all&svcId=322000000120) | 출산한 장애인가정에 출산지원금 지급 | 서울특별시 강남구 | 보조금24, 복지로 | 강함 | `gov24-322000000120` |
| 278 | [x] | [출산양육지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003224&bnefType=all&svcId=322000000109) | 출산양육지원금을 자녀순위에 따라 지원 | 서울특별시 강남구 | 보조금24, 복지로 | 강함 | `gov24-322000000109` |
| 279 | [ ] | [구강보건서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004378&bnefType=all&svcId=322000000112) | 아동,청소년, 노인, 장애인 등에게 구강보건서비스 지원 | 서울특별시 강남구 | 보조금24 | 후보 | `gov24-322000000112` |
| 280 | [ ] | [아동양육시설 입소아동 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005213&bnefType=all&svcId=322000000116) | 아동양육시설 입소아동을 위해 명절 위문금 지급 | 서울특별시 강남구 | 보조금24 | 후보 | `gov24-322000000116` |
| 281 | [x] | [아빠 육아휴직장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2163816&bnefType=all&svcId=322000000125) | 휴직기간당 월 30만원, 최대 1년 1개월 미만 기간은 일할계산(1일 지급액=1만원 기준) | 서울특별시 강남구 | 보조금24, 복지로 | 후보 | `gov24-322000000125` |
| 282 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2186919&bnefType=all&svcId=322000000127) | 출산가정 모유수유 지원을 위한 유축기 대여사업 | 서울특별시 강남구 | 보조금24 | 후보 | `gov24-322000000127` |
| 283 | [ ] | [장애인 휠체어 보장구 수리비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002227&wlfareInfoReldBztpCd=02) | 등록 장애인의 휠체어 수리 비용을 지원하여 지속적이고 안정적으로 휠체어를 사용할 수 있는 환경을 조성함으로써 장애인의 기본적인 이동권과 사회활동… | 서울특별시 강남구 복지생활국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00002227` |

## 서울특별시 송파구 (6건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 284 | [x] | [(송파구)임산부 건강관리 서비스 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001468&bnefType=all&svcId=323000000106) | 임산부에게 엽산제, 철분제, 임신초기검사, 기형아검사, 당뇨검사, 막달검사,유축기 등 지원 | 서울특별시 송파구 | 보조금24 | 강함 | `gov24-323000000106` |
| 285 | [x] | [(송파구)입양가정 입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005763&bnefType=all&svcId=323000000113) | ○ 입양부모에게 입양축하금 지원 | 서울특별시 송파구 | 보조금24 | 강함 | `gov24-323000000113` |
| 286 | [ ] | [(송파구)출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005969&bnefType=all&svcId=323000000117) | 출산부모에게 출산축하금 지원 | 서울특별시 송파구 | 보조금24 | 강함 | `gov24-323000000117` |
| 287 | [x] | [산모건강증진센터 산후조리원 이용료 감면](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2000406&bnefType=all&svcId=O00023700003) | 사회적 취약계층에게 산후조리원 이용요금 감면(대상별 상이) | 서울특별시 송파구 | 보조금24 | 강함 | `gov24-o00023700003` |
| 288 | [ ] | [출산축하금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002337&wlfareInfoReldBztpCd=02) | 출산율 저하에 따른 사회문제에 적극 대처하고 출산축하 분위기 조성 | 서울특별시 송파구 주민복지국 여성보육과 | 복지로 | 강함 | `bokjiro-wlf00002337` |
| 289 | [ ] | [저소득 한부모 가족 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002335&wlfareInfoReldBztpCd=02) | 저소득 한부모가족에게 경제적·심리적 안정을 주고 건강한 사회구성원으로 자립할 수 있도록 지원 | 서울특별시 송파구 주민복지국 여성보육과 | 복지로 | 후보 | `bokjiro-wlf00002335` |

## 서울특별시 강동구 (7건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 290 | [ ] | [입양아동 가족지원 (입양축하금)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002441&wlfareInfoReldBztpCd=02) | 보호가 필요한 아동을 입양한 가정에 입양축하금을 지원하여 입양아동의 권익과 복지 증진에 기여 | 서울특별시 강동구 복지가족국 아동청소년과 | 복지로 | 강함 | `bokjiro-wlf00002441` |
| 291 | [x] | [입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004270&bnefType=all&svcId=324000000111) | 아동입양자에게 입양축하금 지급 | 서울특별시 강동구 | 보조금24 | 강함 | `gov24-324000000111` |
| 292 | [ ] | [다자녀특별장려금 및 입학축하금 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002421&wlfareInfoReldBztpCd=02) | 세 자녀 이상 다자녀가정 양육 지원을 통해 양육 부담 경감 및 출산 장려 분위기 조성 | 서울특별시 강동구 복지가족국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00002421` |
| 293 | [x] | [다자녀특별장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001558&bnefType=all&svcId=324000000107) | 강동구 거주하는 세자녀이상 가정에 지속적인 양육지원 | 서울특별시 강동구 | 보조금24 | 후보 | `gov24-324000000107` |
| 294 | [ ] | [아동친화도시 인프라구축 등 조성](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000823&wlfareInfoReldBztpCd=02) | 아동권리 증진 및 아동이 행복한 아동친화도시 조성 | 서울특별시 강동구 복지가족국 아동청소년과 | 복지로 | 후보 | `bokjiro-wlf00000823` |
| 295 | [ ] | [저소득 한부모 가정지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002134&wlfareInfoReldBztpCd=02) | 저소득 한부모 가족에게 복지서비스를 지원하여 생활안정 도모 | 서울특별시 강동구 복지가족국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00002134` |
| 296 | [ ] | [취약계층아동 위문격려](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002230&wlfareInfoReldBztpCd=02) | 취약계층 아동(아동생활시설 보호 아동 및 가정위탁 아동)에게 명절 및 어린이날에 위문격려금을 지원하여 바르고 건강한 인재 육성 | 서울특별시 강동구 복지가족국 아동청소년과 | 복지로 | 후보 | `bokjiro-wlf00002230` |


## 제외한 항목

### 지금 임신한 분은 대상이 아님 (출생 시기 제한) (2건)

- 286. (송파구)출산축하금 지원 (`gov24-323000000117`): 원문 "2021.12.31.이전 출생아까지만 지급". 일정·금액을 정리하다 발견해 카드에서 뺌
- 288. 출산축하금 지급 (`bokjiro-wlf00002337`): 286과 같은 사업 (복지로판)

### 아이·출산과 관계없는 일반 대상 (40건)

- 20. 뇌병변장애인 신변처리용품 구입비 지원 (`bokjiro-wlf00001941`): 뇌병변장애인 전체 대상
- 34. 취약계층 차열페인트 도장 지원 (`bokjiro-wlf00006412`): 저소득층 주택과 노인·장애인 시설 차열도장
- 55. 장애인 휠체어 수리 지원 (`bokjiro-wlf00000977`): 장애인 휠체어 수리
- 56. 저소득 주민 국민건강보험료 지원 (`bokjiro-wlf00002252`): 저소득 주민 건강보험료
- 66. 저소득자 및 보훈단체 지원(국가유공자 및 유족격려) (`bokjiro-wlf00000981`): 국가보훈대상자 위문금
- 77. 어르신 국가예방접종 지원사업 (`gov24-303000000336`): 어르신 예방접종
- 82. 저소득주민 명절 위문 (기초수급자) (`bokjiro-wlf00002159`): 기초수급자 명절 위문
- 93. 광진동행버스(교통약자)를 위한 무료버스 지원 (`gov24-304000000160`): 교통약자 무료버스
- 94. 민원약자를 위한 원스톱 밀착 동행서비스 (`gov24-304000000235`): 민원약자 동행서비스
- 99. 동대문구 유기동물 입양비 지원 (`gov24-305000000132`): 유기동물 입양비 ("입양" 단어로 걸림)
- 109. 소아‧청소년 제1형 당뇨병 환자 지원사업 (`bokjiro-wlf00006328`): 소아·청소년 1형 당뇨 환자 전체 대상
- 119. 저소득 틈새계층 국민건강보험료 지원 (`bokjiro-wlf00002512`): 저소득 틈새계층 건강보험료
- 131. 저소득주민 위문금 지원 (`bokjiro-wlf00004265`): 저소득 구민 명절 위문금
- 135. 장애인 명절위문품 지원 (`bokjiro-wlf00002828`): 장애인 명절위문품
- 158. 서울시 저소득 중증장애인 전세주택 제공사업 (`bokjiro-wlf00002109`): 저소득 중증장애인 전세주택
- 164. 저소득 중증장애인가구 유료방송 이용요금 지원 (`bokjiro-wlf00000666`): 저소득 중증장애인 유료방송 요금
- 165. 저소득주민 국민건강보험료 지원 (`bokjiro-wlf00002112`): 저소득 주민 건강보험료
- 175. 장애인 및 가족치료 지원 (`gov24-312000000117`): 장애인과 가족 치료
- 177. 저소득 한부모가족 명절위문금 지원 (`bokjiro-wlf00002602`): 저소득 한부모가족 명절위문금
- 209. 자치회관 수강료 감면 지원 (`gov24-316000000148`): 자치회관 수강료 감면
- 217. 한부모가족 명절 격려금 지급 (`bokjiro-wlf00000767`): 저소득 한부모가족 명절격려금
- 218. 유실·유기동물 입양비 지원 (`gov24-318000000432`): 유기동물 입양비
- 228. 유실·유기동물 입양비 지원 (`gov24-319000000136`): 유기동물 입양비
- 231. 교통약자 무료셔틀버스(동작복지카) 운영 (`gov24-319000000144`): 교통약자 무료셔틀
- 233. 동작구 여성 HPV 검사비 지원 참여신청 (`gov24-319000000190`): 여성 HPV 검사비
- 238. 자체 예방접종 (`gov24-319000000122`): 취약계층 인플루엔자 접종
- 239. 저소득층 명절 위문품비 지원 (`gov24-319000000123`): 저소득층 명절 위문품
- 243. 관악구 유기동물 입양비 지원 (`gov24-320000000313`): 유기동물 입양비
- 249. 국가유공자 인플루엔자 백신 및 접종 지원 (`gov24-320000000311`): 국가유공자 인플루엔자 접종
- 250. 기초생활수급자 명절위문금 지원 (`gov24-320000000112`): 기초생활수급자 명절위문금
- 253. 장애인 인플루엔자 백신 및 접종 지원 (`gov24-320000000310`): 장애인 인플루엔자 접종
- 254. 장애인이동기기 수리비 지원 (`bokjiro-wlf00002753`): 장애인 이동기기 수리비
- 255. 취약계층 인플루엔자 백신 및 접종 지원 (`gov24-320000000110`): 취약계층 인플루엔자 접종
- 261. 부랑인 노숙인 관리지원 (`bokjiro-wlf00000796`): 부랑인·노숙인
- 270. 저소득 한부모가정 위문 격려(설날 및 추석) (`bokjiro-wlf00000816`): 저소득 한부모가정 명절 위문
- 279. 구강보건서비스 (`gov24-322000000112`): 아동·청소년·노인·장애인 구강보건
- 283. 장애인 휠체어 보장구 수리비 지원 (`bokjiro-wlf00002227`): 장애인 휠체어 수리비
- 289. 저소득 한부모 가족 지원 (`bokjiro-wlf00002335`): 저소득 한부모가족 일반 지원
- 294. 아동친화도시 인프라구축 등 조성 (`bokjiro-wlf00000823`): 아동친화도시 인프라 조성 (개인 혜택 아님)
- 295. 저소득 한부모 가정지원 (`bokjiro-wlf00002134`): 저소득 한부모가족 생활안정

### 부모가 신청하는 혜택이 아님 (4건)

- 43. 아동양육시설 위문 (`gov24-300000000132`): 아동양육시설 위문
- 44. 지역아동센터 운영 지원 (`gov24-300000000117`): 지역아동센터 운영 지원
- 57. 지역아동센터 운영지원 (`gov24-301000000139`): 지역아동센터 운영 지원
- 280. 아동양육시설 입소아동 지원 (`gov24-322000000116`): 아동양육시설 입소아동 위문금

### 임신·영유아와 거리가 멂 (가정위탁·학대피해·학령기·청소년·청년) (43건)

- 17. 결식 아동 급식지원 (`gov24-611000000150`): 결식우려아동 급식
- 30. 아동치과치료지원 (`gov24-611000000171`): 아동·청소년 구강관리
- 35. 희망두배 청년통장 (`gov24-611000019619`): 근로 청년 대상
- 45. 학대피해아동 마음건강지킴이 사업 (`gov24-300000000166`): 학대피해아동 대상
- 46. 학대피해아동 의료비 지원 (`gov24-300000000167`): 학대피해아동 대상
- 65. 보호대상아동 지원 (`gov24-302000000103`): 가정위탁 등 보호대상아동
- 75. 성동구 청년 등 탈모 치료 지원 (`bokjiro-wlf00005234`): 청년 탈모 치료
- 81. 저소득 한부모가족 지원(명절격려금, 학습참고서비) (`bokjiro-wlf00002157`): 저소득 한부모 명절격려금과 학습참고서비 (학령기)
- 98. 취약계층 어린이 물놀이 수영장 이용권 지원 사업 (`bokjiro-wlf00005401`): 취약계층 어린이 수영장 이용권
- 106. 다자녀 입학축하금 지원 (`gov24-305000000103`): 셋째 이상 입학아동 축하금
- 107. 다자녀가정 입학축하금 (`bokjiro-wlf00002764`): 다자녀 입학축하금 (106과 같은 사업)
- 110. 저소득층 아동 체험행사 (`gov24-305000000173`): 저소득층 아동 체험행사
- 116. 가정위탁아동 격려품 지원 (`bokjiro-wlf00002794`): 가정위탁아동 격려품
- 129. 아동청소년 동행카드 지원 (`gov24-307000000105`): 13세·중학교 1학년 동행카드
- 130. 저소득구민 명절 위문금 지급 (차상위 아동·청소년 가구) (`gov24-307000000110`): 차상위 아동·청소년 가구 명절 위문금
- 133. 강북구 아동·청소년 동행카드 지원사업 (`bokjiro-wlf00005963`): 아동·청소년 동행카드
- 141. 가정위탁아동 지원 (`gov24-309000000129`): 가정위탁아동 지원
- 145. 아동복지시설 만기퇴소 청소년 자립정착금 지원 (`gov24-310000000101`): 보호종료 청소년 자립정착금
- 154. 가정위탁아동 보호지원 (`gov24-311000000143`): 가정위탁아동 보호지원
- 156. 보호대상아동 축하·위문금 지원 (`gov24-311000000116`): 보호대상아동 위문금
- 159. 아동보호조치를 위한 심리·건강 검진 지원 (`gov24-311000000112`): 보호조치 아동 심리·건강 검진
- 160. 아동청소년 심리지원서비스 (`gov24-311000000134`): 아동·청소년 심리지원
- 172. 다자녀가족 둘째아 이상 초등학교 입학축하상품권 지원 (`gov24-312000000107`): 둘째 이상 초등학교 입학축하상품권
- 173. 서대문구 다자녀가족 입학축하상품권 지원사업 (`bokjiro-wlf00005646`): 다자녀 초등학교 입학축하상품권 (172와 같은 사업)
- 184. 아동 예술멘토링 지원서비스(지역사회서비스투자사업) (`gov24-313000000159`): 아동 예술멘토링
- 189. 저소득층 아동학습지 무료지원사업 (`bokjiro-wlf00000726`): 저소득층 아동 학습지
- 196. 학대피해아동 심리검사 및 의료비 지원 (`gov24-315000000113`): 학대피해아동 심리검사·의료비
- 208. 아동·청소년 심리지원서비스 (`gov24-316000000153`): 아동·청소년 심리지원
- 210. 학대피해아동 심리검사 및 의료비 지원 (`gov24-316000000147`): 학대피해아동 심리검사·의료비
- 214. 가정위탁아동 격려금 지원 (`gov24-317000000102`): 가정위탁 격려금
- 215. 가정위탁아동 생일축하금 지원 (`gov24-317000000105`): 가정위탁아동 생일축하금
- 216. 금천구 금천아이성장지원금 지원 (`gov24-317000000367`): 만 7·10·13·16세 대상 성장지원금
- 235. 아동·청소년 심리지원서비스 (`gov24-319000000121`): 아동·청소년 심리지원
- 236. 아동·청소년 정서발달지원서비스 (`gov24-319000000115`): 아동·청소년 정서발달
- 237. 아동학대 피해아동 응급의료비 지원 (`gov24-319000000105`): 학대피해아동 응급의료비
- 256. 서초구 입양아동 양육보조금 지원 (`gov24-321000000108`): 만 18세 초과~고졸 전 입양아동
- 260. 보호종료아동 생활보조수당 (`bokjiro-wlf00004254`): 자립준비청년 생활보조수당
- 262. 서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 교육비 지원 (`gov24-321000000115`): 자립준비청년 교육비
- 263. 서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 생활보조수당 지원 (`gov24-321000000114`): 자립준비청년 생활보조수당
- 264. 서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 자립정착금 지원 (`gov24-321000000121`): 자립준비청년 자립정착금
- 265. 서리풀 희망사다리 프로젝트 자립준비청년(보호종료아동) 자립컨설팅 지원 (`gov24-321000000123`): 자립준비청년 자립컨설팅
- 267. 서초구 가정위탁아동 양육보조금 지원 (`gov24-321000000103`): 가정위탁아동 양육보조금
- 296. 취약계층아동 위문격려 (`bokjiro-wlf00002230`): 아동생활시설 보호 아동과 가정위탁 아동 위문

### 전국 혜택과 같은 사업 (12건)

- 4. 산모·신생아건강관리지원 (`gov24-611000000124`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 7. 서울시 난임부부 시술비 지원 (`gov24-611000000159`): 전국 "난임부부 시술비 지원"과 같은 사업 (출산당 25회, 소득 기준 없음). 원문의 "서울형 난임시술중단 의료비 지원"은 검증 때 따로 봄
- 58. 산모·신생아 건강관리 지원사업 (`bokjiro-wlf00004360`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 78. 어린이 예방접종 지원 (`gov24-303000000104`): 어린이 국가예방접종(만 12세 이하)을 구에서 하는 것. 전국 카드에 국가예방접종이 아직 없음
- 111. 첫만남이용권 (`gov24-305000000113`): 전국 "첫만남이용권 지원"과 같은 사업
- 155. 공동육아나눔터 운영 (`gov24-311000000151`): 전국 "공동육아나눔터 운영"과 같은 사업
- 162. 은평구 드림스타트 (`gov24-311000000133`): 전국 "드림스타트"와 같은 사업
- 198. [구로구](보건복지부)영유아 발달 정밀검사비 지원 (`gov24-316000000129`): 전국 "영유아 발달 정밀검사비 지원"과 같은 사업
- 206. 구로형 심리치료비 (`gov24-316000000141`): 입양아동 상담치료비. 전국 "입양가정위탁아동 심리치료 지원"과 같은 성격
- 240. 첫만남이용권지원 (`gov24-319000000130`): 전국 "첫만남이용권 지원"과 같은 사업
- 251. 예방접종 지원 (`gov24-320000000101`): 국가예방접종을 구에서 하는 것. 전국 카드에 국가예방접종이 아직 없음
- 272. 강남구 영유아 발달 정밀검사 지원 (`gov24-322000000124`): 전국 "영유아 발달 정밀검사비 지원"과 같은 사업

### 다문화가족·외국인 전용 (이번 범위 밖) (2건)

- 14. 이주여성 건강관리 지원 (구)다문화가족 출산 전후 돌봄서비스) (`gov24-611000000155`): 결혼이주여성 대상
- 31. 외국인 아동 보육료 지원 (`bokjiro-wlf00005456`): 어린이집 외국인 재원 아동 대상

### 운영자 판단으로 뺌 (10건)

- 10. 서울시 중소기업 워라밸 포인트제 서울형 출산휴가급여 지원 (`bokjiro-wlf00006026`): 워라밸 포인트제 참여 중소기업 소속 직원만 대상인 기업 인센티브
- 24. 서울시 중소기업 워라밸 포인트제 육아휴직 동료응원수당 (`bokjiro-wlf00006025`): 워라밸 포인트제 참여 중소기업의 육아휴직 대직자 수당
- 26. 서울특별시 서울형 키즈카페 시립 뚝섬 자벌레점 운영 (`bokjiro-wlf00005441`): 서울형 키즈카페 한 지점(뚝섬 자벌레점) 운영
- 91. (광진구)가족관계등록 상담의 날 운영 (`gov24-304000000243`): 혜택이 아니라 가족관계등록 신고 절차 상담
- 123. 성북구 육아종합센터 이용료 및 사용료 감면(경로우대자) (`gov24-307000000218`): 성북구 육아종합센터 이용료 감면 규정 (경로우대자). 같은 규정이 대상별로 6건
- 124. 성북구 육아종합센터 이용료 및 사용료 감면(국가유공자) (`gov24-307000000217`): 성북구 육아종합센터 이용료 감면 규정 (국가유공자)
- 125. 성북구 육아종합센터 이용료 및 사용료 감면(다둥이 행복카드 소지자) (`gov24-307000000219`): 성북구 육아종합센터 이용료 감면 규정 (다둥이 행복카드)
- 126. 성북구 육아종합센터 이용료 및 사용료 감면(수급권자) (`gov24-307000000214`): 성북구 육아종합센터 이용료 감면 규정 (수급권자)
- 127. 성북구 육아종합센터 이용료 및 사용료 감면(장애인) (`gov24-307000000216`): 성북구 육아종합센터 이용료 감면 규정 (장애인)
- 128. 성북구 육아종합센터 이용료 및 사용료 감면(한부모가족) (`gov24-307000000215`): 성북구 육아종합센터 이용료 감면 규정 (한부모가족)

## 합친 원본 (대표 카드의 두 번째 원본, 31건)

- 5. 서울시 1인 자영업자 등 배우자 출산휴가급여 지원 (`bokjiro-wlf00005866`) → 1번 1인 자영업자, 프리랜서 등 출산휴가급여(임산부, 배우자)
- 6. 서울시 1인 자영업자 등 임산부 출산급여 지원 (`bokjiro-wlf00005864`) → 1번 1인 자영업자, 프리랜서 등 출산휴가급여(임산부, 배우자)
- 28. 서울형 가사서비스 지원사업 (`bokjiro-wlf00005849`) → 27번 서울형 가사서비스
- 39. 종로구 둘째아 이상 출산장려 건강보험 가입 지원사업 (`bokjiro-wlf00000955`) → 42번 출산장려 건강보험 가입지원
- 52. 장애인가정 출산지원금 지급 (`bokjiro-wlf00002249`) → 53번 장애인가정 출산지원금 지원
- 63. 출산장려 지원사업(출산지원금 지원) (`bokjiro-wlf00002444`) → 64번 출산지원금 지원
- 68. 보편적 산후조리비용지원 (`bokjiro-wlf00005168`) → 69번 산후조리비용 지원
- 73. 출생축하금지원사업(셋째아 이상) (`bokjiro-wlf00002160`) → 72번 출생축하금 지원
- 80. 장난감세상 운영 (`bokjiro-wlf00002060`) → 79번 장난감세상
- 84. 입양축하금 (`bokjiro-wlf00001003`) → 85번 입양축하금 지원(구비)
- 86. 장애인 특별지원(장애인 가정 출산지원금) (`bokjiro-wlf00002664`) → 87번 장애인가정 출산비용 지원(구비)
- 89. 첫돌축하금 지원 (`bokjiro-wlf00002667`) → 88번 첫돌(출산)축하금 지원
- 96. 장애인 양육지원금 지원사업 (`bokjiro-wlf00004044`) → 97번 장애인가정 양육지원금 지급
- 100. 동대문구 임산부 백일해 예방접종 지원사업 (`bokjiro-wlf00006609`) → 103번 임신부 백일해 예방접종 지원
- 114. 중랑형 출산축하용품 지원사업 (`bokjiro-wlf00006571`) → 115번 출산축하용품 지원
- 136. 도봉구 오!사방복지 출생축하용품 지원사업 (`bokjiro-wlf00005587`) → 140번 출생축하용품 지원
- 138. 산모·신생아 건강관리 지원 확대(본인부담금 지원) (`bokjiro-wlf00001775`) → 137번 산모·신생아 건강관리 본인부담금 지원
- 153. 출산지원 사업(다자녀 출산용품교환권) (`bokjiro-wlf00002207`) → 146번 다자녀 출산용품 교환권 지원
- 167. 모든 임산부 임신축하금 지원 (`bokjiro-wlf00005630`) → 169번 임신축하금 지원
- 171. 입양가정 입양축하금(입양장려금) 지급 (`bokjiro-wlf00004281`) → 170번 입양가정 입양축하금 지급
- 182. 철분제,엽산제 구매(임산부 및 영유아관리) (`bokjiro-wlf00004358`) → 179번 임산부 건강관리 서비스
- 204. 출생축하금 (`bokjiro-wlf00002722`) → 201번 다자녀 출생축하금 지원
- 212. 금천구 입양축하금 지원 (`bokjiro-wlf00002797`) → 211번 국내 입양가정 입양축하금 지원
- 225. 동작출산축하금 및 출산축하용품 (`bokjiro-wlf00002628`) → 223번 동작구 출산축하금 지원
- 226. 미혼모부 양육비 지원사업 (`bokjiro-wlf00003949`) → 232번 동작구 미혼모부 아동양육비 등 지원
- 227. 신생아 건강보험료 지원(둘째이상 신생아 상해질병 보험료 지원) (`bokjiro-wlf00002626`) → 222번 동작구 신생아 상해,질병 보험료 지원
- 252. 장애인 양육지원금 지원 사업 (`bokjiro-wlf00004726`) → 248번 관악구 장애인가정 양육지원금 지급
- 274. 산후건강관리비용 지원 (`bokjiro-wlf00002497`) → 271번 강남구 산후건강관리비용 지원사업(본인부담금 환급)
- 276. 입양아동 지원 (`bokjiro-wlf00000817`) → 275번 입양 및 가정위탁아동 지원
- 290. 입양아동 가족지원 (입양축하금) (`bokjiro-wlf00002441`) → 291번 입양축하금 지원
- 292. 다자녀특별장려금 및 입학축하금 지원 사업 (`bokjiro-wlf00002421`) → 293번 다자녀특별장려금 지원
