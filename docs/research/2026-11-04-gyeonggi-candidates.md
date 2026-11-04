# 경기도 임신·출산·영유아 혜택 후보 목록
- 뽑은 날: 2026-11-04 (`pnpm benefit candidates 4100000000`)
- 출처: 수집해 둔 보조금24(지자체 혜택)와 복지로 지자체. 이미 혜택 목록에 있는 원본은 뺐어요
- 고르는 법: 넣을 항목만 `[ ]`를 `[x]`로 바꿔 주세요. 애매하면 링크로 원문을 확인해요
- 신뢰도 **강함**: 이름이나 생애주기가 임신·출산·영유아. **후보**: 설명에만 관련 단어가 있거나 대상이 넓음
- 모두 417건 (강함 215 · 후보 202)
- 후보가 없는 지역: 경기도 수원시 장안구, 경기도 수원시 권선구, 경기도 수원시 팔달구, 경기도 수원시 영통구, 경기도 성남시 수정구, 경기도 성남시 중원구, 경기도 성남시 분당구, 경기도 안양시 만안구, 경기도 안양시 동안구, 경기도 부천시 원미구, 경기도 부천시 소사구, 경기도 부천시 오정구, 경기도 안산시 상록구, 경기도 안산시 단원구, 경기도 고양시 덕양구, 경기도 고양시 일산동구, 경기도 고양시 일산서구, 경기도 용인시 처인구, 경기도 용인시 기흥구, 경기도 용인시 수지구, 경기도 화성시 만세구, 경기도 화성시 효행구, 경기도 화성시 병점구, 경기도 화성시 동탄구

## 검토 결과 (2026-11-04)

- 방법: 417건을 50건씩 9개 파일로 나눠 다른 AI가 1차로 고르고, 수집해 둔 원문(지원대상, 지원내용)과 대조해 고쳤다. 8번 파일 뒤쪽 28건(#373~#400)은 다른 AI가 판단하지 않아 원문으로 직접 판단했다
- 기준: 인천·청주·서울과 같이 **출산·육아·입양·난임·아이와 관련된 혜택은 포함**
- 포함 195건은 `[x]`. 나머지 222건은 아래 "제외한 항목" 155건과 "합친 원본" 67건
- 경기에서 새로 정한 기준
  - **산모·신생아 건강관리 경기도 추가형.** 경기도가 중위소득 150% 초과 가정까지 건강관리사를 지원한다(평택 원문 "경기도 지원(추가형) : 기준중위소득 150% 초과"). 경기도 카드(6번) 하나로 넣고, 같은 대상을 시·군에서 받는 항목(과천·구리·남양주·오산·하남·파주)은 뺀다
  - **산후조리비.** 원문이 경기도판("출생아 1인당 50만원의 지역화폐")과 같으면 경기도 사업으로 보고 뺀다(시흥·하남·남양주). 지급 방식이나 금액이 다르면 시·군 자체로 넣는다(양주 본인부담금 90% 최대 50만원, 여주 최대 100만원, 의왕·양평 현금 50만원)
  - **한 시 안의 구 보건소가 같은 사업을 나눠 올린 것은 카드 하나로 합친다** (수원·용인·화성·안양·평택)
  - **한 원문에 여러 혜택이 있으면 따로 올라온 항목을 합친다** (성남시 출산장려 지원에 출산장려금·다자녀아동양육수당·다자녀사랑 안심보험, 군포 모자건강지원에 임신축하금)
  - 서울 기준도 그대로 쓴다. 시·군이 더 주는 것(본인부담금, 약제비, 입양축하금, 아이돌봄 추가)은 넣고, 장애인가정 출산지원금과 아빠 육아휴직 장려금은 시·군마다 넣고, 다자녀 조건(수도요금 감면, 다자녀카드)은 아이 조건으로 본다
- 검증 때 따로 볼 것
  - 17번 다자녀가정 아이돌봄 본인부담금: 원문에 "참여 시·군(14개)"이 있어 경기 전체가 아니다
  - 120번 광명 아이조아 첫돌: 복지로 요약뿐이라 무엇을 주는지 원문으로 알 수 없다
  - 243번 의왕, 410번 양평 산후조리비: 경기도 산후조리비와 별개로 더 주는 것인지
  - 6번 경기도 추가형: 복지로 요약뿐이라 평택 원문(125번)을 두 번째 원본으로 붙였다
  - 안양시 보건소 임산부 서비스가 5장(77, 78, 85, 89, 99)으로 나뉜다. 화면 복잡도를 다시 본다
- 정리 때 볼 것
  - 인천 카탈로그의 미추홀·연수 "여성장애인 출산비용 지원" 2건이 전국 "여성장애인 출산비용지원"과 같은 120만원이다 (308번 안성에서 발견)

## 경기도 (23건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 1 | [ ] | [경기도 산후조리비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001361&wlfareInfoReldBztpCd=02) | 출산가정의 경제적 부담 완화 및 산모신생아 건강보호 | 경기도 보건건강국 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00001361` |
| 2 | [x] | [경기도산후조리비지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002198&bnefType=all&svcId=641000000137) | 출산가정의 경제적 부담완화 및 산모신생아 건강보호를 위하여 경기도 거주 출산가정에 출생아 | 경기도 | 보조금24 | 강함 | `gov24-641000000137` |
| 3 | [ ] | [경기임산부 친환경농산물 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006099&wlfareInfoReldBztpCd=02) | ㅇ 친환경농산물의 중장기적인 고정 소비층 확보에 따른 안정적인 소비체계 확립 및 친환경 농업을 통한 환경 보전 등 사회적 가치 구현 ㅇ 임산부에… | 경기도 농수산생명과학국 친환경농업과 | 복지로 | 강함 | `bokjiro-wlf00006099` |
| 4 | [x] | [난임부부 시술비 지원(경기형) 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005283&wlfareInfoReldBztpCd=02) | 난임부부 시술비 확대 지원으로 의료비 부담을 완화하고 임신·출산 친화적 환경을 조성하여 저출산 극복에 기여하고자 함 | 경기도 구리시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00005283` |
| 5 | [x] | [분만취약지 임산부 교통비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2132623&bnefType=all&svcId=641000000671) | 분만취약지 임산부 교통비 지원 | 경기도 | 보조금24, 복지로 | 강함 | `gov24-641000000671` |
| 6 | [x] | [산모 신생아 건강관리 지원사업(추가형)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001366&wlfareInfoReldBztpCd=02) | 출산가정에 건강관리사를 파견하여 산모의 산후 회복과 신생아의 양육을 지원하고, 출산가정의 경제적 부담을 경감 | 경기도 구리시 보건소 지역보건과 | 복지로 | 강함 | `bokjiro-wlf00001366` |
| 7 | [ ] | [산모신생아 건강관리사 지원 확대](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001022&wlfareInfoReldBztpCd=02) | 출산가정에 산모신생아 건강관리사를 파견하여 산모의 산후관리 및 신생아 양육지원 | 경기도 오산시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00001022` |
| 8 | [x] | [임산부 친환경농산물 공급지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2148316&bnefType=all&svcId=641000000693) | 임산부(임신부+출산부)에게 친환경농산물 등 공급지원 | 경기도 | 보조금24 | 강함 | `gov24-641000000693` |
| 9 | [ ] | [한방난임 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003476&wlfareInfoReldBztpCd=02) | 난임부부의 다양한 요구를 수용한 지원정책으로 경제적 부담을 완화하고 임신 출산의 사회의료적 장애를 제거하여 저출산 극복에 기여 | 경기도 보건건강국 의료자원과 | 복지로 | 강함 | `bokjiro-wlf00003476` |
| 10 | [x] | [한방난임사업 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006171&bnefType=all&svcId=641000000175) | ○ 난임부부에게 한방 의료를 통한 난임치료 지원 | 경기도 | 보조금24 | 강함 | `gov24-641000000175` |
| 11 | [ ] | [가정위탁 양육지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000686&wlfareInfoReldBztpCd=02) | 가정위탁 아동이 가정적인 환경에서 건전한 사회인으로 자라날 수 있도록 양육보조금 지원 | 경기도 여성가족국 아동돌봄과 | 복지로 | 후보 | `bokjiro-wlf00000686` |
| 12 | [ ] | [결식아동급식지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005609&bnefType=all&svcId=641000000171) | 결식우려아동에게 급식 지원 | 경기도 | 보조금24, 복지로 | 후보 | `gov24-641000000171` |
| 13 | [ ] | [경기도 체육인 기회소득](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2156161&bnefType=all&svcId=641000000704) | 체육인에게 기회소득을 지급하여 체육활동 지속 및 사회적 가치 확산 도모 | 경기도 | 보조금24 | 후보 | `gov24-641000000704` |
| 14 | [ ] | [경기도 한부모가족복지시설 퇴소자 자립지원금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003288&wlfareInfoReldBztpCd=02) | 한부모가족복지 시설 퇴소자에 대한 최소한의 자립지원금을 보조하여 자립에 도움을 주고자 함 | 경기도 여성가족국 가족다문화과 | 복지로 | 후보 | `bokjiro-wlf00003288` |
| 15 | [ ] | [고난이도 보호대상아동 맞춤형사례관리](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006204&wlfareInfoReldBztpCd=02) | 아동복지법 제38조에 근거하여 보호대상 경계선지능아동에게 체계적인 사례관리 및 자립지원 서비스를 제공함으로써 사회 부적응을 예방함. | 경기도 여주시 문화복지국 가족복지과 | 복지로 | 후보 | `bokjiro-wlf00006204` |
| 16 | [x] | [누리과정 차액보육료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002226&bnefType=all&svcId=641000000144) | 3~5세 유아가 도내 어린이집(민간, 가정 등)을 이용하는 경우 보육료 지원 | 경기도 | 보조금24, 복지로 | 후보 | `gov24-641000000144` |
| 17 | [x] | [다자녀가정 아이돌봄 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2158316&bnefType=all&svcId=641000000725) | 돌봄서비스의 경제적 부담 경감 | 경기도 | 보조금24 | 후보 | `gov24-641000000725` |
| 18 | [ ] | [미등록 이주배경아동 보육지원금(어린이집 직접지원)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006773&wlfareInfoReldBztpCd=02) | 출생 이후 돌봄의 공백 속에 방치되는 미등록 이주배경 아동의 기본권 보장 | 경기도 이민사회국 이민사회지원과 | 복지로 | 후보 | `bokjiro-wlf00006773` |
| 19 | [ ] | [아동안전지킴이 활동비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2185216&bnefType=all&svcId=641000000859) | 자원봉사 활동비 지원(활동실비, 교통비, 간식비) | 경기도 | 보조금24 | 후보 | `gov24-641000000859` |
| 20 | [ ] | [장애인맞춤형지원사](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000792&bnefType=all&svcId=641000000116) | 저소득 등록장애인에게 생활지원, 산모지원, 육아지원 서비스 제공 | 경기도 | 보조금24 | 후보 | `gov24-641000000116` |
| 21 | [ ] | [저소득층 청각장애인 재활지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000720&wlfareInfoReldBztpCd=02) | 저소득층 청각장애인 의료비 부담 경감 및 사회 경제활동 활성화 도모 | 경기도 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000720` |
| 22 | [ ] | [청각장애인 인공달팽이관 수술지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002250&bnefType=all&svcId=641000000149) | 저소득의 청각장애인에게 인공달팽이관 수술비, 재활치료비 지원 | 경기도 | 보조금24, 복지로 | 후보 | `gov24-641000000149` |
| 23 | [ ] | [한부모가족 아동양육비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005606&wlfareInfoReldBztpCd=02) | 아동양육비를 지원받지 못하는 한부모가족에 양육비를 지원함으로써 한부모가족의 경제적 부담을 경감하고자 한 사업입니다. 소득인정액이 정부지원 기준(… | 경기도 여성가족국 가족정책과 | 복지로 | 후보 | `bokjiro-wlf00005606` |

## 경기도 수원시 (25건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 24 | [x] | [(수원시 권선구) 임산부 및 예비·신혼부부 검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165319&bnefType=all&svcId=374000000573) | 수원시에 거주하는 예비·신혼부부부터 임산부까지 기본검사를 지원하는 서비스 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000573` |
| 25 | [x] | [(수원시 권선구) 임산부 우울 선별검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165324&bnefType=all&svcId=374000000577) | ○ 임산부의 산전, 산후 우울 선별검사 및 상담 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000577` |
| 26 | [ ] | [(수원시 영통구) 임산부 및 예비·신혼부부 검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165322&bnefType=all&svcId=374000000575) | 수원시에 거주하는 예비·신혼부부부터 임산부까지 기본검사를 지원하는 서비스 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000575` |
| 27 | [ ] | [(수원시 영통구) 임산부 우울 선별검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165326&bnefType=all&svcId=374000000579) | ○ 임산부의 산전, 산후 우울 선별검사 및 상담 연계 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000579` |
| 28 | [ ] | [(수원시 장안구) 임산부 및 예비·신혼부부 검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165318&bnefType=all&svcId=374000000572) | 수원시에 거주하는 예비·신혼부부부터 임산부까지 기본검사를 지원하는 서비스 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000572` |
| 29 | [ ] | [(수원시 장안구) 임산부 우울 선별검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165323&bnefType=all&svcId=374000000576) | ○ 임산부의 산전, 산후 우울 선별검사 및 상담 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000576` |
| 30 | [ ] | [(수원시 팔달구) 임산부 및 예비·신혼부부 검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165321&bnefType=all&svcId=374000000574) | 수원시에 거주하는 예비·신혼부부부터 임산부까지 기본검사를 지원하는 서비스 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000574` |
| 31 | [ ] | [(수원시 팔달구) 임산부 우울 선별검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165325&bnefType=all&svcId=374000000578) | ○ 임산부의 산전, 산후 우울 선별검사 및 상담 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000578` |
| 32 | [x] | [(수원시) 둘째자녀 이상 출산여성 산후조리 한약할인 안내](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2167124&bnefType=all&svcId=374000000583) | 출산일 1개월 전 수원시에 주민등록을 두고 거주하는 둘째아 이상 출산 여성에게 한약 지원 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000583` |
| 33 | [x] | [수원시 난임부부 원외처방 약제비 지원(권선구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2125610&bnefType=all&svcId=374000000559) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000559` |
| 34 | [ ] | [수원시 난임부부 원외처방 약제비 지원(영통구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2125606&bnefType=all&svcId=374000000558) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000558` |
| 35 | [ ] | [수원시 난임부부 원외처방 약제비 지원(장안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2125401&bnefType=all&svcId=374000000556) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000556` |
| 36 | [ ] | [수원시 난임부부 원외처방 약제비 지원(팔달구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2125501&bnefType=all&svcId=374000000557) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000557` |
| 37 | [ ] | [수원시 자녀 출산·입양 지원금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001377&wlfareInfoReldBztpCd=02) | 저출산 및 고령사회 기본법 및 입양 특례법에 따라 출산 · 입양 장려 분위기를 조성하기 위하여, 첫째자녀 이상 출산가정과 넷째자녀 이상 입양가정… | 경기도 수원시 여성가족국 여성정책과 | 복지로 | 강함 | `bokjiro-wlf00001377` |
| 38 | [x] | [수원시 출생·입양 지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005640&bnefType=all&svcId=374000000136) | ○ 출생·입양 지원금 지급 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000136` |
| 39 | [x] | [장애인가정 출산 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004049&bnefType=all&svcId=374000000130) | 등록 장애인에게 출산지원금 지급 | 경기도 수원시 | 보조금24 | 강함 | `gov24-374000000130` |
| 40 | [ ] | [장애인가정 출산지원금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001378&wlfareInfoReldBztpCd=02) | 저출산 시대에 장애인가정에 출산을 지원하여 장애인복지 향상을 도모하고 사회통합복지 이념 실현 | 경기도 수원시 시민복지국 장애인복지과 | 복지로 | 강함 | `bokjiro-wlf00001378` |
| 41 | [x] | [(수원시 권선구) 유축기 대여 지원 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165217&bnefType=all&svcId=374000000566) | 유축기대여지원서비스 | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000566` |
| 42 | [ ] | [(수원시 영통구) 아토피·천식 예방관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168323&bnefType=all&svcId=374000000592) | 수원시에 거주하는 만18세 미만 저소득층 청소년 및 영유아 아토피 질환 지원 서비스 | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000592` |
| 43 | [ ] | [(수원시 영통구) 유축기 대여 지원 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165219&bnefType=all&svcId=374000000568) | 수원시에 거주하는 출산 후 1개월 이내 산모에게 유축기 대여하는 서비스입니다. | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000568` |
| 44 | [ ] | [(수원시 장안구) 유축기 대여 지원 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165216&bnefType=all&svcId=374000000565) | 수원시에 거주하는 출산 후 1개월 이내 산모에게 유축기 대여하는 서비스입니다. | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000565` |
| 45 | [ ] | [(수원시 팔달구) 유축기 대여 지원 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165218&bnefType=all&svcId=374000000567) | 수원시에 거주하는 출산 산모(출산 1개월 이내)에게 유축기를 대여하는 서비스입니다. | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000567` |
| 46 | [x] | [보육료지원아동보육경비지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006453&bnefType=all&svcId=374000000143) | 법정저소득층 등의 아동에게 보육료 외 필요경비(입학준비금 및 현장학습비) 지원 | 경기도 수원시 | 보조금24 | 후보 | `gov24-374000000143` |
| 47 | [ ] | [수원시 아동담당의 의료지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001375&wlfareInfoReldBztpCd=02) | 수원시 취약계층 아동을 대상으로 질환예방을 위한 보건교육, 진료상담을 통해 치료가 필요한 아동에게 치료비지원 실시하여 아동의 건강한 성장을 지원… | 경기도 수원시 권선구보건소 건강관리과 | 복지로 | 후보 | `bokjiro-wlf00001375` |
| 48 | [ ] | [예비 신혼 부부를 위한 건강검진](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001376&wlfareInfoReldBztpCd=02) | 결혼과 임신 전 건강검진을 통해 본인의 건강 확인 및 감염성 질환을 미리 알고 대처함으로써 건강한 가정, 건강한 아기 출산을 준비 할 수 있도록… | 경기도 수원시 장안구보건소 건강관리과 | 복지로 | 후보 | `bokjiro-wlf00001376` |

## 경기도 성남시 (23건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 49 | [ ] | [산모·신생아 건강관리 서비스 제공](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004273&bnefType=all&svcId=378000000153) | 출산가정에 산모신생아 건강관리 서비스 지원 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000153` |
| 50 | [x] | [성남시 출산장려 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001316&bnefType=all&svcId=378000000143) | 출산가정 및 다자녀 양육가정에 출산장려금과 다자녀아동양육수당 및 다자녀사랑 안심보험 지원 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000143` |
| 51 | [x] | [임산부 유축기 대여 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003416&bnefType=all&svcId=378000000150) | 출산산모에게 유축기 대여 지원 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000150` |
| 52 | [x] | [입양아동 양육수당(추가)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005282&bnefType=all&svcId=378000000159) | 입양아동의 양육수당 지원 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000159` |
| 53 | [x] | [입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001319&bnefType=all&svcId=378000000146) | 입양아동의 입양축하금 지원 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000146` |
| 54 | [x] | [장애인가정 출산지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004041&bnefType=all&svcId=378000000152) | 출산한 장애인가정에 출산지원금 지급 | 경기도 성남시 | 보조금24 | 강함 | `gov24-378000000152` |
| 55 | [ ] | [장애인가정 출산지원금지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001274&wlfareInfoReldBztpCd=02) | 장애인의 출산을 장려하고 저출산 시대의 사회적 문제해소에 기여 | 경기도 성남시 복지국 장애인복지과 | 복지로 | 강함 | `bokjiro-wlf00001274` |
| 56 | [ ] | [출산장려금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001360&wlfareInfoReldBztpCd=02) | 저출산 극복을 위한 시책사업으로 출산분위기 조성 | 경기도 성남시 복지국 여성가족과 | 복지로 | 강함 | `bokjiro-wlf00001360` |
| 57 | [x] | [「다자녀 해피하우스」무주택 저소득 다자녀가구 주거지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004731&wlfareInfoReldBztpCd=02) | 무주택저소득다자녀가구의 임대보증금 및 임대료 지원 | 경기도 성남시 도시주택국 주택과 | 복지로 | 후보 | `bokjiro-wlf00004731` |
| 58 | [ ] | [다자녀사랑 안심보험](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006151&wlfareInfoReldBztpCd=02) | 예기치 못한 의료비를 보장하며, 다자녀 가정의 금전적 부담을 줄이기 위해 | 경기도 성남시 복지국 여성가족과 | 복지로 | 후보 | `bokjiro-wlf00006151` |
| 59 | [ ] | [다자녀아동양육수당](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001568&wlfareInfoReldBztpCd=02) | 저출산 극복을 위한 시책사업으로 자녀양육에 따른 가정경제 부담경감 | 경기도 성남시 복지국 여성가족과 | 복지로 | 후보 | `bokjiro-wlf00001568` |
| 60 | [ ] | [성남시 노동취약계층 유급병가비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806103&bnefType=all&svcId=378000000164) | 입원치료 및 공단 일반검진 시 무급휴무일에 대한 생활급여 지원 | 경기도 성남시 | 보조금24 | 후보 | `gov24-378000000164` |
| 61 | [ ] | [성남시 다자녀가구 대학생 등록금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809988&bnefType=all&svcId=378000000167) | 성남시 다자녀가구(자녀 3명이상)의 셋째 이상 자녀 등록금 지원 학기당 최대 100만원 | 경기도 성남시 | 보조금24 | 후보 | `gov24-378000000167` |
| 62 | [x] | [성남시 다자녀가구 전세자금 대출이자 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000279&bnefType=all&svcId=378000000135) | 성남시 무주택 다자녀가구에 전세자금 대출이자 지원 | 경기도 성남시 | 보조금24, 복지로 | 후보 | `gov24-378000000135` |
| 63 | [ ] | [성남시 아동의료비 본인부담 100만원 상한제 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001629&wlfareInfoReldBztpCd=02) | 의료비로 인한 경제적 부담을 경감하고 아동의 건강권과 생명권 보호 | 경기도 성남시 공공의료정책관 | 복지로 | 후보 | `bokjiro-wlf00001629` |
| 64 | [ ] | [수급자, 저소득층 특수촬영비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001569&wlfareInfoReldBztpCd=02) | 특수장비촬영비(CT, MRI, MRA)를 연1회 70만원까지 무상지원하여 의료복지향상에 기여코자 함 | 경기도 성남시 복지국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00001569` |
| 65 | [x] | [아동 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000732&bnefType=all&svcId=378000000137) | 18세 미만 아동에게 의료비 본인부담분(필수 비급여) 지원 | 경기도 성남시 | 보조금24 | 후보 | `gov24-378000000137` |
| 66 | [x] | [아동수당플러스 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001318&bnefType=all&svcId=378000000145) | 8세 미만 아동에게 아동수당 체크카드 포인트로 지원 | 경기도 성남시 | 보조금24, 복지로 | 후보 | `gov24-378000000145` |
| 67 | [ ] | [저소득가구 전세임대 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001276&wlfareInfoReldBztpCd=02) | 기초생활보장수급자 및 차상위계층에 속하는 주거환경이 취약한 저소득층에게 전대함으로써 실질적인 자립기반을 조성할 수 있도록 하기 위함. | 경기도 성남시 도시주택국 주택과 | 복지로 | 후보 | `bokjiro-wlf00001276` |
| 68 | [ ] | [저소득세대 건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000710&wlfareInfoReldBztpCd=02) | 국민건강보험료와 「노인장기요양보험법」에 따른 장기요양보험료(이하 “보험료 등”이라 한다)를 납부하는 데 어려움을 겪는 저소득계층에게 보험료를 지… | 경기도 성남시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000710` |
| 69 | [ ] | [저소득중증청각장애인재활치료비지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001297&wlfareInfoReldBztpCd=02) | 청각장애인 재활 치료비 지원으로 의료비부담 경감 | 경기도 성남시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001297` |
| 70 | [ ] | [중증장애인 사회적응활동 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001298&wlfareInfoReldBztpCd=02) | 장애극복 및 사회적응을위한 재활교육비 지원 | 경기도 성남시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001298` |
| 71 | [ ] | [학대피해아동 의료비 등 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006452&bnefType=all&svcId=378000000163) | 학대피해아동에게 건강진단검사, 진료비, 긴급 생필품 등 지원 | 경기도 성남시 | 보조금24 | 후보 | `gov24-378000000163` |

## 경기도 의정부시 (4건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 72 | [x] | [임산부 건강관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003863&bnefType=all&svcId=382000000137) | 임신준비 여성 및 임산부에게 엽산제 및 산전검사 지원 | 경기도 의정부시 | 보조금24 | 강함 | `gov24-382000000137` |
| 73 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001694&bnefType=all&svcId=382000000129) | 첫째 이상 출생신고한 부모에게 출산장려금 지원 | 경기도 의정부시 | 보조금24, 복지로 | 강함 | `gov24-382000000129` |
| 74 | [ ] | [국가예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005215&bnefType=all&svcId=382000000139) | 어린이 및 노인, 임신부 및 의료취약계층(일부 지원사업)에게 국가예방접종 비용 지원 | 경기도 의정부시 | 보조금24 | 후보 | `gov24-382000000139` |
| 75 | [ ] | [의사상자 특별위로금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001404&wlfareInfoReldBztpCd=02) | 의사상자의 숭고한 희생정신과 용기가 주민에게 항구적으로 존중되어 지역사회의 정의구현에 이바지하기 위함. | 경기도 의정부시 복지국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00001404` |

## 경기도 안양시 (25건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 76 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000390&bnefType=all&svcId=383000000101) | 출산가정에 산모신생아건강관리사 서비스 지원 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000101` |
| 77 | [x] | [임산부 자동차표지 제공](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803595&bnefType=all&svcId=383000000147) | 임산부 1명당 1대의 차량에 한하여, 임산부자동차 표지 발급 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000147` |
| 78 | [x] | [임신부 산전검사(초기검사)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803303&bnefType=all&svcId=383000000141) | 임신부 초기 혈액검사(산전검사) | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000141` |
| 79 | [x] | [임신축하금 지원/출산지원금 지원(동안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001402&bnefType=all&svcId=383000000110) | 임산부 및 출산가정에 임신축하금과 출산지원금 지급 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000110` |
| 80 | [ ] | [임신축하금 지원/출산지원금 지원(만안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005771&bnefType=all&svcId=383000000127) | 임신부 및 출산가정에 임신축하금과 출산지원금 지급 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000127` |
| 81 | [x] | [입양아동 입양축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803302&bnefType=all&svcId=383000000139) | 입양아동의 입양축하금 지원 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000139` |
| 82 | [ ] | [입양아동 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001403&bnefType=all&svcId=383000000111) | 초중고 입학예정인 입양아동 가정에 입학준비금 지원 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000111` |
| 83 | [ ] | [장애인가정 출산장려금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002478&wlfareInfoReldBztpCd=02) | 장애인 가정의 출산 시 산모 및 신생아의 건강관리와 장애인 가정의 생활안정에 도움을 줌 | 경기도 안양시 복지문화국 장애인복지과 | 복지로 | 강함 | `bokjiro-wlf00002478` |
| 84 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005772&bnefType=all&svcId=383000000128) | 장애인가구 출산시 장애정도에 따라 출산지원금 지원 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000128` |
| 85 | [x] | [출산준비교육](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803306&bnefType=all&svcId=383000000144) | 출산준비교육 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000144` |
| 86 | [ ] | [출산준비교육(동안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803610&bnefType=all&svcId=383000000157) | 다양한 임산부 교육 프로그램 운영 | 경기도 안양시 | 보조금24 | 강함 | `gov24-383000000157` |
| 87 | [ ] | [2026년 청년 어학·자격시험 응시료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104220&bnefType=all&svcId=383000000209) | 미취업 청년 대상 어학·자격시험 응시료 지원 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000209` |
| 88 | [ ] | [가정위탁 아동지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001040&wlfareInfoReldBztpCd=02) | 가정위탁아동 명절 위문품 지원 | 경기도 안양시 복지문화국 아동과 | 복지로 | 후보 | `bokjiro-wlf00001040` |
| 89 | [x] | [기형아검사비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803496&bnefType=all&svcId=383000000154) | 임신부 기형아검사 쿠폰 발급 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000154` |
| 90 | [x] | [내 생에 첫 도서관](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=804004&bnefType=all&svcId=383000000194) | 무료 도서택배 서비스 (1인 월2회 5권) | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000194` |
| 91 | [x] | [법정저소득 및 셋째아 필요경비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004584&wlfareInfoReldBztpCd=02) | 법정저소득 및 다자녀가정(셋째 이상) 교육비 지원으로 공보육 체계 강화 및 출산 장려 | 경기도 안양시 복지문화국 여성가족과 | 복지로 | 후보 | `bokjiro-wlf00004584` |
| 92 | [x] | [법정저소득 및 셋째아이상 원아 유아학비 및 입학준비금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003354&wlfareInfoReldBztpCd=02) | 관내 유치원에 다니는 법정 저소득 및 셋째아 이상 원아들을 대상으로 유아학비 및 입학준비금을 시에서 지원하여 학부모의 유아교육비 부담을 경감하고… | 경기도 안양시 복지문화국 교육청소년과 | 복지로 | 후보 | `bokjiro-wlf00003354` |
| 93 | [x] | [아이좋아 행복꾸러미 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000520&bnefType=all&svcId=383000000103) | 출생아를 위해 육아용품 지원 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000103` |
| 94 | [ ] | [안양시 공공체육시설 사용료 감면](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803692&bnefType=all&svcId=383000000190) | 국가유공자 등에게 공공체육시설 개인 사용료 감면 혜택을 제공하고자 함. | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000190` |
| 95 | [ ] | [어린이집 공기청정기 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803531&bnefType=all&svcId=383000000176) | 어린이집 내 실내공기청정기 운영비를 지원함으로써 아동들을 위한 쾌적한 실내보육환경 조성 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000176` |
| 96 | [x] | [어린이집 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001406&bnefType=all&svcId=383000000114) | 안양시 어린이집에 최초 입소한 아동에게 입학준비금 지원 | 경기도 안양시 | 보조금24, 복지로 | 후보 | `gov24-383000000114` |
| 97 | [ ] | [어린이집 전기레인지 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803534&bnefType=all&svcId=383000000180) | 어린이집 전기레인지 지원 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000180` |
| 98 | [x] | [예비부모 건강검진 지원(동안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803497&bnefType=all&svcId=383000000155) | 임신 계획중인 예비부모에게 무료건강검진 실시 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000155` |
| 99 | [x] | [유축기 대여 서비스 제공(만안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803304&bnefType=all&svcId=383000000142) | 유축기 대여 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000142` |
| 100 | [ ] | [유축기 대여 서비스(동안구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=803498&bnefType=all&svcId=383000000156) | 유축기 대여 | 경기도 안양시 | 보조금24 | 후보 | `gov24-383000000156` |

## 경기도 부천시 (8건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 101 | [x] | [장애인 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001265&bnefType=all&svcId=386000000114) | 지원기준에 적합한 등록장애인이 출산 시 출산지원금 지급 (출산일 기준 1년 이내 신청) | 경기도 부천시 | 보조금24, 복지로 | 강함 | `gov24-386000000114` |
| 102 | [ ] | [출산지원금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004313&wlfareInfoReldBztpCd=02) | 출산 가정의 경제적 부담 완화, 지역 인구 유출 억제 및 정주 여건 개선을 위하여 출산지원금 지급 | 경기도 부천시 복지국 여성다문화과 | 복지로 | 강함 | `bokjiro-wlf00004313` |
| 103 | [x] | [출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005829&bnefType=all&svcId=386000000131) | 출산 또는 입양 가정에 출산지원금 지급 | 경기도 부천시 | 보조금24 | 강함 | `gov24-386000000131` |
| 104 | [ ] | [부천시 취약계층 아동치과주치의사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2187416&bnefType=all&svcId=386000000147) | - 보건소 1차 검진 후 치과주치의 의료기관 연계 대상자 구강질환 치료 | 경기도 부천시 | 보조금24 | 후보 | `gov24-386000000147` |
| 105 | [ ] | [외국인 아동(누리3~5세) 보육료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001857&bnefType=all&svcId=386000000118) | 외국인아동(3~5세)에게 어린이집 부모부담 보육료 지원 | 경기도 부천시 | 보조금24 | 후보 | `gov24-386000000118` |
| 106 | [x] | [워킹맘(대디) 가사지원서비스](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005135&wlfareInfoReldBztpCd=02) | 워킹맘(대디), 한부모가정의 가사부담 완화와 생활안정, 여성의 사회참여를 지원하는 사업입니다. - 이용대상: 부천시 거주 맞벌이 또는 일하는 한… | 경기도 부천시 복지국 여성다문화과 | 복지로 | 후보 | `bokjiro-wlf00005135` |
| 107 | [ ] | [저소득 장애인 지원(인공달팽이관 수술자 재활치료비)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001199&wlfareInfoReldBztpCd=02) | 저소득 청각장애인의 인공달팽이관 재활치료비 지원으로 장애인가구의 의료비 부담 경감 및 청력회복으로 원활한 사회활동 도모를 목적으로 함 | 경기도 부천시 복지위생국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001199` |
| 108 | [ ] | [초등학생 입학준비금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006399&wlfareInfoReldBztpCd=02) | 저출산 인구감소로 학령인구가 감소하는 상황에서, 지자체 차원의 생활 밀착형 복지 서비스를 제공하여 시민체감도를 높임 소득수준과 관계 없이 모든 … | 경기도 부천시 평생교육국 평생교육과 | 복지로 | 후보 | `bokjiro-wlf00006399` |

## 경기도 광명시 (15건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 109 | [x] | [광명시 난임부부 시술비 약제비 지원(난임시술 이후 원외처방 약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2152418&bnefType=all&svcId=390000000436) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 광명시 | 보조금24 | 강함 | `gov24-390000000436` |
| 110 | [ ] | [기형아 검사 쿠폰 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001449&wlfareInfoReldBztpCd=02) | 기형아 이상 여부의 발견 확률이 높은 사중지표검사(Quad test) 비용을 지원하여 임신·출산 가정의 경제적 부담을 덜고 건강한 신생아 출산에… | 경기도 광명시 보건소 감염병관리과 | 복지로 | 강함 | `bokjiro-wlf00001449` |
| 111 | [ ] | [산전 검사 쿠폰 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001469&wlfareInfoReldBztpCd=02) | 광명시 관내 모든 임산부에게 임신 초기에 산모의 건강 상태 검사와 임신 가정의 경제적 부담 경감으로 안전하고 건강한 임신과 출산에 기여 | 경기도 광명시 보건소 감염병관리과 | 복지로 | 강함 | `bokjiro-wlf00001469` |
| 112 | [x] | [아이소망 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104579&bnefType=all&svcId=390000000129) | 중위소득180%이하 신선배아1-4차 신청자 추가 지원 | 경기도 광명시 | 보조금24, 복지로 | 강함 | `gov24-390000000129` |
| 113 | [x] | [임산부 산전 및 기형아 검사비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001883&bnefType=all&svcId=390000000106) | 등록 임산부에게 산전검사비와 기형아 검사비 지원 | 경기도 광명시 | 보조금24 | 강함 | `gov24-390000000106` |
| 114 | [x] | [출산축하금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004098&bnefType=all&svcId=390000000113) | 출산가정에 출산축하금 지원 | 경기도 광명시 | 보조금24 | 강함 | `gov24-390000000113` |
| 115 | [ ] | [출산축하금지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001541&wlfareInfoReldBztpCd=02) | 우리 시 모든 출산 가정에 자녀의 출산을 축하하는 출산축하금 지급을 통해 출산친화적 지역사회 분위기 조성 | 경기도 광명시 돌봄복지국 성평등가족과 | 복지로 | 강함 | `bokjiro-wlf00001541` |
| 116 | [x] | [한방 난임치료 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001542&wlfareInfoReldBztpCd=02) | 만혼 및 고령출산 등으로 난임부부 증가에 따라 기존 양방 난임시술 지원 외에 한방 난임치료 지원으로 임신·출산 성공률 제고하고자 함. | 경기도 광명시 보건소 감염병관리과 | 복지로 | 강함 | `bokjiro-wlf00001542` |
| 117 | [ ] | [광명시 저소득층 아동 치과주치의 의료지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001448&wlfareInfoReldBztpCd=02) | 저소득층 아동 구강건강을 위한 치과 의료 지원 | 경기도 광명시 보건소 보건정책과 | 복지로 | 후보 | `bokjiro-wlf00001448` |
| 118 | [ ] | [시설퇴소 및 가정위탁종결아동 자립정착금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001934&bnefType=all&svcId=390000000108) | 시설퇴소 및 가정위탁종결아동에게 자립정착금 지급 | 경기도 광명시 | 보조금24 | 후보 | `gov24-390000000108` |
| 119 | [x] | [아빠 육아휴직 장려금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004890&wlfareInfoReldBztpCd=02) | 남성 근로자의 육아휴직을 장려하고 양육에 따른 경제적 부담을 완화하여 일과 가정생활의 양립 및 가족 친화적인 사회환경 조성을 목적 | 경기도 광명시 돌봄복지국 성평등가족과 | 복지로 | 후보 | `bokjiro-wlf00004890` |
| 120 | [x] | [아이조아 첫돌](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005458&wlfareInfoReldBztpCd=02) | ○ 출산·양육에 대한 지원을 통한 출산 장려 ○ 광명시 출생인구가 광명시에 정주할 수 있도록 기획하여 생애주기 맞춤형 지원 정책 강화 | 경기도 광명시 돌봄복지국 성평등가족과 | 복지로 | 후보 | `bokjiro-wlf00005458` |
| 121 | [ ] | [저소득 장애인 생활안정 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004492&bnefType=all&svcId=390000000115) | 여성 출산장애인에게 출산지원금 | 경기도 광명시 | 보조금24 | 후보 | `gov24-390000000115` |
| 122 | [ ] | [저소득장애인 생활안정지원 사업(청각장애아동 인공달팽이관 재활치료)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001472&wlfareInfoReldBztpCd=02) | 장애인의 생활안정에 기여함 | 경기도 광명시 사회복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001472` |
| 123 | [ ] | [저소득층 아동 치과치료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004539&bnefType=all&svcId=390000000116) | 지역아동센터 및 그룹홈 아동에게 치과 예방처치 및 치료 지원 | 경기도 광명시 | 보조금24 | 후보 | `gov24-390000000116` |

## 경기도 평택시 (14건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 124 | [x] | [다자녀가정 양육지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006695&bnefType=all&svcId=391000000149) | 셋째아 이상 및 36개월 이하 자녀의 가정에 양육지원금 지급 | 경기도 평택시 | 보조금24, 복지로 | 강함 | `gov24-391000000149` |
| 125 | [ ] | [산모신생아 건강관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001593&bnefType=all&svcId=391000000120) | 출산가구에 임산부 건강관리 서비스 지원(산모신생아 건강관리 서비스 ) | 경기도 평택시 | 보조금24, 복지로 | 강함 | `gov24-391000000120` |
| 126 | [ ] | [장애아동 입양 양육보조금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001434&bnefType=all&svcId=391000000116) | 장애아동을 국내 입양한 가정에 양육보조금 지원 | 경기도 평택시 | 보조금24 | 강함 | `gov24-391000000116` |
| 127 | [x] | [출산축하지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001443&bnefType=all&svcId=391000000117) | 출산축하지원금 지원 | 경기도 평택시 | 보조금24 | 강함 | `gov24-391000000117` |
| 128 | [ ] | [치매환자 조호물품 지원(기저귀, 위생매트 등)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003690&bnefType=all&svcId=391000000128) | 조호물품 제공사업(겉기저귀, 속기저귀, 물티슈, 위생매트 등) | 경기도 평택시 | 보조금24 | 강함 | `gov24-391000000128` |
| 129 | [ ] | [평택시 난임부부 약제비 지원(송탄보건소)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2152920&bnefType=all&svcId=391000000549) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 평택시 | 보조금24 | 강함 | `gov24-391000000549` |
| 130 | [x] | [평택시 난임부부 약제비 지원(평택보건소)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2163231&bnefType=all&svcId=391000000550) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 평택시 | 보조금24 | 강함 | `gov24-391000000550` |
| 131 | [ ] | [가정위탁 양육보조금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004975&bnefType=all&svcId=391000000138) | 가정위탁 아동에게 양육보조금 지원 | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000138` |
| 132 | [ ] | [가정위탁아동 학습활동 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001307&bnefType=all&svcId=391000000111) | 가정위탁 보호 아동에게 학습활동 관련 비용 지원 | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000111` |
| 133 | [ ] | [결식아동 휴일급식 지원 사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001592&bnefType=all&svcId=391000000119) | ○ 결식 아동 학기 중 토·공휴일 급식(중식) 지원(1식 10,000원) | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000119` |
| 134 | [ ] | [보호종료아동 자립수당](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001431&bnefType=all&svcId=391000000113) | 아동복지시설 퇴소 및 가정위탁 보호종료 아동에게 자립수당 지원 | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000113` |
| 135 | [x] | [사립유치원 셋째아 이상 교육비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003985&wlfareInfoReldBztpCd=02) | 평택시 출산 장려 정책의 일환으로 사립유치원 셋째아 이상 자녀에 대한 교육비 지원을 통해 학부모의 유아 교육비 부담 경감 | 경기도 평택시 행정자치국 교육청소년과 | 복지로 | 후보 | `bokjiro-wlf00003985` |
| 136 | [ ] | [퇴소 및 보호종결아동 자립정착금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000120&bnefType=all&svcId=391000000103) | 아동복지시설 퇴소 및 가정위탁 종결아동 자립정착금 지급 | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000103` |
| 137 | [ ] | [평택시 청년 월세 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005800&bnefType=all&svcId=391000000144) | 중위소득 120% 이하 청년 1인가구에 월세 지원 | 경기도 평택시 | 보조금24 | 후보 | `gov24-391000000144` |

## 경기도 동두천시 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 138 | [x] | [[경기도 동두천시] 난임부부 시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2184116&bnefType=all&svcId=392000000169) | 동두천시 난임부부 시술비 지원 신청자 중 정부지원금 잔액 발생시 원외약제비 온라인 청구 | 경기도 동두천시 | 보조금24 | 강함 | `gov24-392000000169` |
| 139 | [x] | [여성장애인 출산지원금 및 양육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003648&bnefType=all&svcId=392000000107) | 출산 여성장애인에게 출산지원금 및 양육비 지원 | 경기도 동두천시 | 보조금24, 복지로 | 강함 | `gov24-392000000107` |
| 140 | [x] | [출산 및 돌 축하용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004083&bnefType=all&svcId=392000000109) | 출산가구에 출산 축하용품과 돌 축하용품 지원 | 경기도 동두천시 | 보조금24 | 강함 | `gov24-392000000109` |
| 141 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001832&bnefType=all&svcId=392000000106) | 동두천시 거주 요건(거주기간:1년)을 채운 부 또는 모에게 출산장려금 지원 | 경기도 동두천시 | 보조금24, 복지로 | 강함 | `gov24-392000000106` |
| 142 | [ ] | [강남구청 인터넷수능방송 수강료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2117510&bnefType=all&svcId=392000000164) | 강남구청 인터넷수능방송 연간 수강료 지원 (자기부담금 5천원) | 경기도 동두천시 | 보조금24 | 후보 | `gov24-392000000164` |
| 143 | [x] | [다자녀가구 수도요금 감면 조건 완화](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002592&wlfareInfoReldBztpCd=02) | 복지대상자의 공공요금 부담을 완화하기 위해 수도요금 감면 | 경기도 동두천시 환경사업소 | 복지로 | 후보 | `bokjiro-wlf00002592` |
| 144 | [x] | [동두천시 다자녀행복카드](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004366&wlfareInfoReldBztpCd=02) | ㅇ 다자녀가구의 양육·생활비용 부담을 줄이기 위한 시 자체 다자녀 할인 혜택 대상자를 증명하기 위함 ㅇ 가족관계증명서 등 종이서류 제출 번거로움… | 경기도 동두천시 복지문화국 가족지원과 | 복지로 | 후보 | `bokjiro-wlf00004366` |
| 145 | [ ] | [신혼부부 및 청년 전월세 보증금 대출이자 지원사업 계획](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006089&wlfareInfoReldBztpCd=02) | ○ 무주택 신혼부부· 청년의 전‧월세 보증금 대출이자 지원을 통한 경제적 부담 완화 및 주거안정 기여 ○ 혼인 인구 감소 및 저출산 시대에 적극… | 경기도 동두천시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00006089` |
| 146 | [ ] | [행려자 보호](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002597&wlfareInfoReldBztpCd=02) | 행려자 보호 및 지원 | 경기도 동두천시 자치행정국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00002597` |

## 경기도 안산시 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 147 | [x] | [안산시 임산부 행복플러스카드](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2102103&bnefType=all&svcId=393000000150) | 임산부가정의 공공기간 및 공영주차장 이용 시 이용료 감면 제공 | 경기도 안산시 | 보조금24 | 강함 | `gov24-393000000150` |
| 148 | [x] | [영유아 양육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003997&bnefType=all&svcId=393000000126) | 부 또는 모와 관내에 주민등록을 두고 거주하고 있는 둘째 이상 자녀에게 월 3만원 지급 | 경기도 안산시 | 보조금24, 복지로 | 강함 | `gov24-393000000126` |
| 149 | [x] | [장애인가정 출산 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005637&bnefType=all&svcId=393000000136) | 등록장애인 및 상이등급(1~7급)가정의 출생아 1인당 1,000천원 지급 | 경기도 안산시 | 보조금24, 복지로 | 강함 | `gov24-393000000136` |
| 150 | [x] | [찾아가는 임신출산관리서비스](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005732&wlfareInfoReldBztpCd=02) | 찾아가는 임신출산관리서비스(1:1 방문 임산부 요가, 명상 등) 제공을 통한 임산부의 건강증진을 도모한다. | 경기도 안산시 상록수보건소 | 복지로 | 강함 | `bokjiro-wlf00005732` |
| 151 | [x] | [출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006332&bnefType=all&svcId=393000000140) | 출산가정에 출생축하금 및 축하용품 지원 | 경기도 안산시 | 보조금24, 복지로 | 강함 | `gov24-393000000140` |
| 152 | [ ] | [출생축하용품 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002807&wlfareInfoReldBztpCd=02) | 관내 모든 출산가정에 출생축하용품을 지원하여 출산장려 및 저출산 인식 개선에 기여 | 경기도 안산시 복지국 여성보육과 | 복지로 | 강함 | `bokjiro-wlf00002807` |
| 153 | [ ] | [다자녀 학자금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000665&bnefType=all&svcId=393000000104) | 다자녀가구의 넷째 이상에게 고등학교 공납금 및 다섯째이상에게 대학교 학자금 지원 | 경기도 안산시 | 보조금24 | 후보 | `gov24-393000000104` |
| 154 | [ ] | [안산 행복플러스카드](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002707&wlfareInfoReldBztpCd=02) | 출산 친화적인 사회 분위기 조성을 위하여 다자녀가정 및 임산부에 공공시설 사용료를 감면하여 경제적 부담을 완화하고 출산을 장려하고 함 | 경기도 안산시 복지국 여성보육과 | 복지로 | 후보 | `bokjiro-wlf00002707` |
| 155 | [x] | [안산시 다자녀 가정 렌터카 지원 사업(넷째아 이상 다자녀 가정 차량(대여) 지원 사업)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005919&wlfareInfoReldBztpCd=02) | 다자녀 가정의 이동 편의를 지원하여 가족 단위 여가 활동 활성화에 기여하고, 가족친화 사회환경 조성 및 경제적 부담 경감하여 출산·양육하기 좋은… | 경기도 안산시 복지국 여성보육과 | 복지로 | 후보 | `bokjiro-wlf00005919` |
| 156 | [x] | [안산시 다자녀 행복플러스카드](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2102102&bnefType=all&svcId=393000000149) | 두자녀 이상의 다자녀가구가 공공기관 및 공영주차장 이용 시 이용료 감면 제공 | 경기도 안산시 | 보조금24 | 후보 | `gov24-393000000149` |
| 157 | [x] | [한부모가정 일가정양립 가사서비스 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004862&wlfareInfoReldBztpCd=02) | ˚ 저소득 한부모가정 중 근로취약계층의 가사부담 완화를 위한 가사활동지원 서비스를 제공하여 일·생활 균형 문제 해소 ˚ 저소득 한부모가정을 위한… | 경기도 안산시 복지국 여성보육과 | 복지로 | 후보 | `bokjiro-wlf00004862` |

## 경기도 고양시 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 158 | [x] | [고양시 출산가구 전월세자금 대출이자 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2107904&bnefType=all&svcId=394000000138) | 기준중위소득 150% 이하 무주택 출산가구에 전월세자금 대출이자를 최대 4년간 연1회 지원 | 경기도 고양시 | 보조금24, 복지로 | 강함 | `gov24-394000000138` |
| 159 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002085&bnefType=all&svcId=394000000113) | 임산부에게 산모신생아 건강관리 서비스 지원 | 경기도 고양시 | 보조금24 | 강함 | `gov24-394000000113` |
| 160 | [x] | [임신중 영양제 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004965&bnefType=all&svcId=394000000127) | 임산부에게 철분제와 엽산제 지원 | 경기도 고양시 | 보조금24 | 강함 | `gov24-394000000127` |
| 161 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004023&bnefType=all&svcId=394000000122) | 출산한 장애인가정에 출산지원금 지급 | 경기도 고양시 | 보조금24, 복지로 | 강함 | `gov24-394000000122` |
| 162 | [x] | [출산·양육 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005718&bnefType=all&svcId=394000000129) | 고양시 출산 가정에 출산지원금, 탄생축하 쌀 케이크, 다복꾸러미 지원 | 경기도 고양시 | 보조금24 | 강함 | `gov24-394000000129` |
| 163 | [ ] | [출산지원금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002522&wlfareInfoReldBztpCd=02) | 저출생 극복을 위한 출산장려 목적으로 출산에 따른 경제적비용 부담 경감을 위하여 출산가정에 일정금액을 지원 | 경기도 고양시 복지여성국 여성가족과 | 복지로 | 강함 | `bokjiro-wlf00002522` |
| 164 | [x] | [고양시 저소득 미혼 한부모 양육생계비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004720&wlfareInfoReldBztpCd=02) | 경제적 부담과 사회적 편견으로 생활이 어려운 저소득 미혼 한부모 가족에게 양육생계비를 지원함으로써, 자녀의 안정적인 양육환경을 조성하여 가족해체… | 경기도 고양시 복지여성국 여성가족과 | 복지로 | 후보 | `bokjiro-wlf00004720` |
| 165 | [ ] | [고양시 한시적 양육비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004191&wlfareInfoReldBztpCd=02) | 양육비 미지급으로 인해 미성년 자녀의 양육에 어려움을 겪는 양육비 채권자에게 한시적으로 양육비를 지원함으로써 안전한 양육환경을 조성 | 경기도 고양시 사회복지국 여성가족과 | 복지로 | 후보 | `bokjiro-wlf00004191` |
| 166 | [ ] | [상수도요금감면(기초생활수급자,국가(독립)유공자,어린이집,유치원,사회복지시설,다문화가정,한부모가정,다자녀가정)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003929&wlfareInfoReldBztpCd=02) | 기초생활수급자,국가(독립)유공자,어린이집,유치원,사회복지시설,다문화가정,한부모가정,다자녀가정의 상수도요금 감면으로 경제적 부담 경감 및 생활안정… | 경기도 고양시 상하수도사업소 수도행정과 | 복지로 | 후보 | `bokjiro-wlf00003929` |
| 167 | [ ] | [저소득층 청각장애인 재활지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001417&wlfareInfoReldBztpCd=02) | 인공달팽이관 수술을 받은 청각장애인에게 재활치료비 지원을 통한 의료비 부담 경감 | 경기도 고양시 사회복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001417` |

## 경기도 과천시 (17건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 168 | [x] | [과천시 출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003798&bnefType=all&svcId=397000000117) | 출산가정에 출산장려금 지원 | 경기도 과천시 | 보조금24 | 강함 | `gov24-397000000117` |
| 169 | [x] | [산모 신생아 건강관리 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2120203&bnefType=all&svcId=397000000141) | 산모·신생아 건강관리 지원사업 본인부담금 90% 지원(최대 100만원 한도) | 경기도 과천시 | 보조금24 | 강함 | `gov24-397000000141` |
| 170 | [ ] | [산모 신생아 건강관리 서비스(확대)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002091&bnefType=all&svcId=397000000110) | 출산가정에 건강관리 서비스 지원 | 경기도 과천시 | 보조금24 | 강함 | `gov24-397000000110` |
| 171 | [x] | [새 생명 탄생 출산축하용품 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003981&wlfareInfoReldBztpCd=02) | 출산 친화적 분위기 조성으로 저출산 극복에 기여하고, 가정의 경제적 부담을 경감하는 사업입니다. | 경기도 과천시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00003981` |
| 172 | [x] | [임신축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2123605&bnefType=all&svcId=397000000142) | 주민등록상 3개월 이상 과천시 거주 보건소 등록 임산부에 임신축하금 지원 | 경기도 과천시 | 보조금24, 복지로 | 강함 | `gov24-397000000142` |
| 173 | [ ] | [입양아동 양육수당](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005445&bnefType=all&svcId=397000000121) | - 만18세 ~ 만19세 미만 입양아동 - 신규입양 후 3년간 지원 | 경기도 과천시 | 보조금24 | 강함 | `gov24-397000000121` |
| 174 | [x] | [장애인가정 출산 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006692&bnefType=all&svcId=397000000124) | 장애인가정에 출산지원금 지급 | 경기도 과천시 | 보조금24 | 강함 | `gov24-397000000124` |
| 175 | [ ] | [장애인가정 출산지원금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001484&wlfareInfoReldBztpCd=02) | 장애인가정의 출산 시 산모 및 신생아의 건강관리와 장애인가정의 생활안정 | 경기도 과천시 경제복지국 사회복지과 | 복지로 | 강함 | `bokjiro-wlf00001484` |
| 176 | [ ] | [출산·입양장려금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001514&wlfareInfoReldBztpCd=02) | 출산장려금 및 입양장려금 지원으로 저출산 극복 | 경기도 과천시 문화복지국 아동복지과 | 복지로 | 강함 | `bokjiro-wlf00001514` |
| 177 | [ ] | [태아기형아검사 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001515&wlfareInfoReldBztpCd=02) | 임산부에게 기형아검사쿠폰서비스를 제공함으로써 태아의 사전 예방적 관리를 통해 장애발생 최소화 및 건강수준 향상도모 | 경기도 과천시 보건소 | 복지로 | 강함 | `bokjiro-wlf00001515` |
| 178 | [ ] | [교통약자이동지원센터 운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000974&wlfareInfoReldBztpCd=02) | 이동에 상당한 제약이 있는 장애인에게 차량운행을 통해 직장 출퇴근, 외출보조 및 병원이용 보조 등 각종 이동서비스 지원으로 장애인의 사회 활동기… | 경기도 과천시 건설도시국 교통과 | 복지로 | 후보 | `bokjiro-wlf00000974` |
| 179 | [ ] | [국민기초생활 보장지원(월동난방비, 대학생전공교재비, 이사비용, 쓰레기봉투비, 진단서 발급비용)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001491&wlfareInfoReldBztpCd=02) | 국민기초생활 보장지원을 통한 수급자의 안정적 생활 지원 | 경기도 과천시 경제복지국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00001491` |
| 180 | [x] | [기형아선별검사 쿠폰 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002117&bnefType=all&svcId=397000000112) | 임신부에게 태아기형검사 쿠폰지원 | 경기도 과천시 | 보조금24 | 후보 | `gov24-397000000112` |
| 181 | [ ] | [다자녀 양육바우처 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2117416&bnefType=all&svcId=397000000140) | 8세 이상 13세 미만의 둘째아 이상 자녀를 대상으로 다자녀 양육바우처를 지역화폐로 지원 | 경기도 과천시 | 보조금24, 복지로 | 후보 | `gov24-397000000140` |
| 182 | [ ] | [신혼부부 주택전세자금 대출이자 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001512&wlfareInfoReldBztpCd=02) | 관내 거주하는 무주택 신혼부부에게 주택전세자금 대출이자를 지원함으로써 주거비 부담을 경감시키고, 생애주기별 출산장려 정책을 추진하여 초저출산시대… | 경기도 과천시 경제복지국 아동복지과 | 복지로 | 후보 | `bokjiro-wlf00001512` |
| 183 | [x] | [장애아동 재활치료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004882&bnefType=all&svcId=397000000119) | 중증장애아동에게 재활치료비 지원 | 경기도 과천시 | 보조금24 | 후보 | `gov24-397000000119` |
| 184 | [ ] | [화장장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104346&bnefType=all&svcId=397000000134) | 과천시 관내 주민 등이 사망한 경우 그 연고자에게 화장장려금 지원 | 경기도 과천시 | 보조금24 | 후보 | `gov24-397000000134` |

## 경기도 구리시 (14건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 185 | [x] | [구리시 난임부부 시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2133316&bnefType=all&svcId=398000000298) | 난임부부 시술비 지원대상자에게 원외처방 약제비 지원 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000298` |
| 186 | [x] | [구리시 임산부 교통비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2177916&bnefType=all&svcId=398000000301) | 임산부가 이용하는 교통비 지급(최대10만원 이내), 대중교통비,택시,자차,주유비 등 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000301` |
| 187 | [ ] | [산모·신생아 건강관리 지원(자체사업)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001904&bnefType=all&svcId=398000000111) | 중위소득 150% 초과 출산가정에 산모신생아 건강관리 서비스 지원 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000111` |
| 188 | [x] | [신생아 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001905&bnefType=all&svcId=398000000112) | 구리시 출생신고 모든 출산가정에 출산지원금 지급 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000112` |
| 189 | [ ] | [입양아동 입학축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005250&bnefType=all&svcId=398000000119) | 입양아동 중 초,중,고등학교 신입생에게 입학축하금 지원 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000119` |
| 190 | [x] | [장애인가정 출산지원장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000336&bnefType=all&svcId=398000000103) | 장애인 출산가정에 출산지원장려금 지급 | 경기도 구리시 | 보조금24 | 강함 | `gov24-398000000103` |
| 191 | [ ] | [첫째아이부터 신생아 출산지원금 확대 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003556&wlfareInfoReldBztpCd=02) | 구리시에 거주하는 임산부와 영아의 건강관리를 도모하고, 저출산 고령사회 기본법과 건강가정 기본법에 따라 출산율 저하에 따른 노동력 감소와 인구노… | 경기도 구리시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00003556` |
| 192 | [ ] | [가정위탁아동 능력개발비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000438&bnefType=all&svcId=398000000104) | 가정위탁아동 중 초,중,고등학생에게 학원 및 학습지 수강료 지원 | 경기도 구리시 | 보조금24, 복지로 | 후보 | `gov24-398000000104` |
| 193 | [x] | [다자녀가구 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000895&bnefType=all&svcId=398000000106) | 다자녀가구에 지역화폐 지원 | 경기도 구리시 | 보조금24 | 후보 | `gov24-398000000106` |
| 194 | [ ] | [다자녀가구 행복더하기(지역화폐)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003868&wlfareInfoReldBztpCd=02) | 출산가정 및 다자녀가정에 대한 사회적우대 분위기조성과 출산ㆍ양육에 따른 경제적 부담 경감을 통한 출산율 향상 도모 | 경기도 구리시 복지문화국 가족복지과 | 복지로 | 후보 | `bokjiro-wlf00003868` |
| 195 | [ ] | [어린이집 이용 아동(다자녀 아동 등) 입소료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003554&wlfareInfoReldBztpCd=02) | 다자녀 및 사회취약계층 아동의 어린이집 입소료 지원을 통해 원활한 보육여건 조성을 도모 | 경기도 구리시 복지문화국 가족복지과 | 복지로 | 후보 | `bokjiro-wlf00003554` |
| 196 | [x] | [어린이집 이용아동 입소료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001395&bnefType=all&svcId=398000000109) | 어린이집에 입소하는 다자녀 아동 및 저소득층 아동 등에게 입소료 지원 | 경기도 구리시 | 보조금24 | 후보 | `gov24-398000000109` |
| 197 | [ ] | [저소득장애인주거환경 개선 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000996&wlfareInfoReldBztpCd=02) | 저소득층 장애인의 열악한 주거환경 개선을 도모함으로 쾌적한 삶의 환경 조성 | 경기도 구리시 복지문화국 노인장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000996` |
| 198 | [ ] | [차상위계층 건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003555&wlfareInfoReldBztpCd=02) | 차상위계층(한부모 등) 중 건강보험료가 보건복지부가 정한 최저보험료 (2025년 최저보험료: 22,340원/ 매년 변경됨 )이하인 세대에 건강보… | 경기도 구리시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00003555` |

## 경기도 남양주시 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 199 | [ ] | [남양주시 산후조리비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005268&wlfareInfoReldBztpCd=02) | 남양주시 출산가정에 산후조리비를 지원하여 출산가정의 경제적 부담을 줄이고 산후회복 및 산모와 신생아의 건강증진을 도모하고자 함. | 경기도 남양주시 남양주보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00005268` |
| 200 | [ ] | [산모·신생아 건강관리 지원(추가형)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003415&bnefType=all&svcId=399000000112) | 중위소득 150% 초과 출산가정에 산모신생아 건강관리 서비스 지원 | 경기도 남양주시 | 보조금24 | 강함 | `gov24-399000000112` |
| 201 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001410&bnefType=all&svcId=399000000102) | 장애인가정에게 출산지원금 지급 | 경기도 남양주시 | 보조금24, 복지로 | 강함 | `gov24-399000000102` |
| 202 | [ ] | [중풍 ‧ 와상 노인 생활용품 지원(기저귀)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001825&bnefType=all&svcId=399000000107) | 기초생활수급자 중 장기요양 등급 외 대상자 중 중풍 ‧ 와상 질환 노인 | 경기도 남양주시 | 보조금24 | 강함 | `gov24-399000000107` |
| 203 | [x] | [출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001420&bnefType=all&svcId=399000000105) | ○ 출생아 당 100만원 남양주사랑상품권(지역화폐) 지원 | 경기도 남양주시 | 보조금24 | 강함 | `gov24-399000000105` |
| 204 | [ ] | [가정위탁 아동 능력개발비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003147&bnefType=all&svcId=399000000111) | 가정위탁아동에게 학원수강비 지원 | 경기도 남양주시 | 보조금24, 복지로 | 후보 | `gov24-399000000111` |
| 205 | [x] | [다자녀가정 종량제봉투 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2105607&bnefType=all&svcId=399000000122) | 2자녀 이상 가정 종량제봉투 지원 | 경기도 남양주시 | 보조금24, 복지로 | 후보 | `gov24-399000000122` |
| 206 | [x] | [수도요금 감면(다자녀)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2001322&bnefType=all&svcId=O00005900001) | 다자녀 가구에 대해 가정용 수도 최대 10톤에 해당하는 요금 감면 | 경기도 남양주시 | 보조금24 | 후보 | `gov24-o00005900001` |
| 207 | [ ] | [청각장애인 인공달팽이관 재활치료비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001016&wlfareInfoReldBztpCd=02) | 청각장애인 인공달팽이관 수술 및 재활지원으로 의료비 부담 경감 및 사회,경제 활동 활성화 도모 | 경기도 남양주시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001016` |

## 경기도 오산시 (14건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 208 | [x] | [35세 이상 고위험 임산부 기형아 검사비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2171919&bnefType=all&svcId=400000000128) | 오산시 거주35세 이상 고위험임산부에게 기형아 검사비 본인 부담금 1인 최대 30만원 지원 | 경기도 오산시 | 보조금24 | 강함 | `gov24-400000000128` |
| 209 | [x] | [보완적 출산장려 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005221&bnefType=all&svcId=400000000114) | 출산가정에 출산축하용품 지급 | 경기도 오산시 | 보조금24 | 강함 | `gov24-400000000114` |
| 210 | [ ] | [보완적 출산장려지원 (첫째아이 이상 출산지원금 지급)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004253&wlfareInfoReldBztpCd=02) | 출산율 제고 및 다자녀가정의 경제적 부담 경감 | 경기도 오산시 복지교육국 가족보육과 | 복지로 | 강함 | `bokjiro-wlf00004253` |
| 211 | [ ] | [보완적 출산장려지원 (출산축하용품)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003657&wlfareInfoReldBztpCd=02) | 저출산 극복을 위한 출산장려 지원 | 경기도 오산시 복지교육국 가족보육과 | 복지로 | 강함 | `bokjiro-wlf00003657` |
| 212 | [ ] | [산모 · 신생아 건강관리 지원 서비스(확대)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005365&bnefType=all&svcId=400000000115) | 중위소득 150% 초과 출산가정에 임산부 및 신생아 건강관리 서비스 지원 | 경기도 오산시 | 보조금24 | 강함 | `gov24-400000000115` |
| 213 | [x] | [임산부 영양제 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001375&bnefType=all&svcId=400000000108) | 임산부 및 신혼부부에게 엽산제와 철분제 지원 | 경기도 오산시 | 보조금24 | 강함 | `gov24-400000000108` |
| 214 | [ ] | [공공치료기관 이용 아동 재활치료비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001909&wlfareInfoReldBztpCd=02) | 공공치료기관 이용아동 치료비 지원 | 경기도 오산시 복지교육국 노인장애인과 | 복지로 | 후보 | `bokjiro-wlf00001909` |
| 215 | [ ] | [어린이집 입학준비금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003680&wlfareInfoReldBztpCd=02) | 관내 어린이집을 이용 중인 법정저소득층 자녀에게 입학금을 지원함으로써 저소득층의 경제적 부담 완화 및 안정된 보육환경 조성 | 경기도 오산시 복지교육국 가족보육과 | 복지로 | 후보 | `bokjiro-wlf00003680` |
| 216 | [x] | [어린이집 입학준비금(현장학습비 등) 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001374&bnefType=all&svcId=400000000107) | ○ 법정저소득층 및 관내 영유아에게 입학준비금 지원 | 경기도 오산시 | 보조금24 | 후보 | `gov24-400000000107` |
| 217 | [ ] | [오산시 청년 및 신혼부부 주택임차 보증금 대출이자 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006191&wlfareInfoReldBztpCd=02) | ‧ 오산시 청년 및 신혼부부의 주택임차 보증금 대출이자를 지원함으로 주거비 부담 완화, 안정된 정주여건 조성, 출산 장려, 경제적 자립 지원, … | 경기도 오산시 도시주택국 주택과 | 복지로 | 후보 | `bokjiro-wlf00006191` |
| 218 | [ ] | [저소득 한부모가정 아동발달 지원계좌 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003788&wlfareInfoReldBztpCd=02) | 저소득 한부모가족 자녀의 자립을 위한 경제적 지원 | 경기도 오산시 복지교육국 가족보육과 | 복지로 | 후보 | `bokjiro-wlf00003788` |
| 219 | [ ] | [저소득 한부모가정 지원 (연료비)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003789&wlfareInfoReldBztpCd=02) | 저소득 한부모가족 및 국민기초수급자 한부모가족 1가구당 연1회 연료비 지원 | 경기도 오산시 복지교육국 가족보육과 | 복지로 | 후보 | `bokjiro-wlf00003789` |
| 220 | [ ] | [중증장애인 택시요금 할인카드 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002994&wlfareInfoReldBztpCd=02) | 중증장애인들에게 택시요금 할인지원 사업을 통해 중증장애인의 교통비 부담을 경감하고, 이동권을 보장함으로서 사회활동 참여와 자립생활을 기회를 제공… | 경기도 오산시 복지교육국 노인장애인과 | 복지로 | 후보 | `bokjiro-wlf00002994` |
| 221 | [ ] | [청각장애아동재활치료비](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003763&wlfareInfoReldBztpCd=02) | - 청각장애인의 재활치료 지원으로 의료비 부담 경감 및 사회, 경제 활동 활성화 도모. | 경기도 오산시 복지교육국 노인장애인과 | 복지로 | 후보 | `bokjiro-wlf00003763` |

## 경기도 시흥시 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 222 | [ ] | [시흥시 산후조리비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2162416&bnefType=all&svcId=401000000489) | 출생일로부터 12개월 내 신청한 출산가정에 한해 출생아 1인당 지역화폐 50만원 지원 | 경기도 시흥시 | 보조금24, 복지로 | 강함 | `gov24-401000000489` |
| 223 | [ ] | [출생 미등록 아동 발굴 및 지원 사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2126001&bnefType=all&svcId=401000000484) | 출생 미등록 아동을 위한 시흥아동확인증 발급 | 경기도 시흥시 | 보조금24 | 강함 | `gov24-401000000484` |
| 224 | [x] | [출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004491&bnefType=all&svcId=401000000113) | 신생아 출생신고일 기준 부 또는 모가 시흥시에 180일이상 거주한 출산 가정에 지원 | 경기도 시흥시 | 보조금24, 복지로 | 강함 | `gov24-401000000113` |
| 225 | [ ] | [시흥형 주거비(아동 주거비) 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001424&bnefType=all&svcId=401000000104) | 무주택 월세가구에 기초주거급여 기준임대료의 50% 지급 | 경기도 시흥시 | 보조금24 | 후보 | `gov24-401000000104` |
| 226 | [ ] | [신혼부부 전세대출금 이자지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005461&wlfareInfoReldBztpCd=02) | 무주택 신혼부부의 주거비 부담을 완화하고 안정된 정주여건 조성으로 혼인과 저출산 문제 극복 | 경기도 시흥시 도시주택국 주택과 | 복지로 | 후보 | `bokjiro-wlf00005461` |
| 227 | [ ] | [외국인아동보육료 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003149&bnefType=all&svcId=401000000110) | 외국인아동에게 어린이집 보육료 지원 | 경기도 시흥시 | 보조금24 | 후보 | `gov24-401000000110` |
| 228 | [ ] | [유기 및 위기아동지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000809&wlfareInfoReldBztpCd=02) | 유기 및 위기아동(학대피해아동)의 응급치료비, 응급안전용품, 아동돌보미 파견 비용 지원을 통한 건강 및 보호 지원 | 경기도 시흥시 복지국 아동돌봄과 | 복지로 | 후보 | `bokjiro-wlf00000809` |
| 229 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2164816&bnefType=all&svcId=401000000493) | 출산 후 유축기 필요 가구에게 유축기 대여 서비스 제공 | 경기도 시흥시 | 보조금24 | 후보 | `gov24-401000000493` |
| 230 | [ ] | [장애인 재활프로그램](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003822&wlfareInfoReldBztpCd=02) | 장애아동, 장애인에게 적절한 재활프로그램을 지원하여 장애아동가족의 경제적 부담을 경감하고, 사회참여와 통합을 도모함 | 경기도 시흥시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00003822` |
| 231 | [ ] | [장애인보장구수리센터운영](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000810&wlfareInfoReldBztpCd=02) | 소외계층인 저소득장애인을 대상으로 보장구 수리에 따른 경제적 부담 완화 | 경기도 시흥시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000810` |
| 232 | [ ] | [장애인특별운송사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001372&wlfareInfoReldBztpCd=02) | 거동이 불편한 장애인을 위한 이동수단 제공 | 경기도 시흥시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00001372` |

## 경기도 군포시 (7건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 233 | [ ] | [임신축하금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001473&wlfareInfoReldBztpCd=02) | 임신한 대상자에게 임신축하금을 지급함으로써 출산장려 분위기 조성하여 출산률 향상에 기여 | 경기도 군포시 보건소 산본보건지소 | 복지로 | 강함 | `bokjiro-wlf00001473` |
| 234 | [x] | [출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806314&bnefType=all&svcId=402000000119) | ○ 출생축하금 지원 출생을 축하하고 양육에 따른 경제적 부담 경감을 위한 정책 | 경기도 군포시 | 보조금24, 복지로 | 강함 | `gov24-402000000119` |
| 235 | [x] | [군포시 내 생애 첫 도서관 운영](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169699&bnefType=all&svcId=402000000144) | 군포시에 거주하는 임산부, 생후 12개월 이하 자녀가 있는 보호자 대상 도서 대출서비스지원 | 경기도 군포시 | 보조금24 | 후보 | `gov24-402000000144` |
| 236 | [x] | [모자건강지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001396&bnefType=all&svcId=402000000104) | 임산부에게 임신축하금, 영양제, 쿼드검사비 등 지원 | 경기도 군포시 | 보조금24 | 후보 | `gov24-402000000104` |
| 237 | [x] | [어린이집 생애 최초 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004880&bnefType=all&svcId=402000000110) | 군포시 1년이상 거주하고 관내어린이집에 첫입소한 아동에게 입학준비금 지원 | 경기도 군포시 | 보조금24, 복지로 | 후보 | `gov24-402000000110` |
| 238 | [ ] | [외국인자녀 보육료 추가 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005251&bnefType=all&svcId=402000000111) | 외국인아동에게 어린이집 보육료 일부 지원 | 경기도 군포시 | 보조금24 | 후보 | `gov24-402000000111` |
| 239 | [ ] | [청년날개 면접정장 무료대여](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2129044&bnefType=all&svcId=402000000130) | 구직면접용 정장 무료대여 | 경기도 군포시 | 보조금24 | 후보 | `gov24-402000000130` |

## 경기도 의왕시 (19건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 240 | [ ] | [산모건강관리사 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005091&wlfareInfoReldBztpCd=02) | 출산가정의 경제적 부담을 완화하고 산모의 건강한 산후 회복과 신생아 양육 도모 | 경기도 의왕시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00005091` |
| 241 | [x] | [영유아 북스타트 도서 배포](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001668&bnefType=all&svcId=403000000114) | 아동을 위해 생애주기별로 북스타트 도서 제공 | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000114` |
| 242 | [x] | [의왕시 산모건강관리사 본인부담금 환급 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2110116&bnefType=all&svcId=403000000144) | ○ 산모건강관리사 이용 시, 비용의 본인부담금 90% 지원(50만원 한도내) | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000144` |
| 243 | [x] | [의왕시 산후조리비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2114706&bnefType=all&svcId=403000000151) | 출산가정에 의왕시 산후조리비 지급 | 경기도 의왕시 | 보조금24, 복지로 | 강함 | `gov24-403000000151` |
| 244 | [x] | [임산부 자동차표지 제공](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169541&bnefType=all&svcId=403000000173) | 임산부 자동차 표지 제공 | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000173` |
| 245 | [x] | [임신성 당뇨 및 빈혈검사 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169540&bnefType=all&svcId=403000000172) | 임산부에게 임신성 당뇨 및 빈혈검사 지원 | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000172` |
| 246 | [x] | [임신축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809952&bnefType=all&svcId=403000000130) | ○ 임신시 임신축하금 10만원(지역화폐) 지급 | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000130` |
| 247 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005891&bnefType=all&svcId=403000000123) | 장애인가정이 출산 시 출산지원금 지급 | 경기도 의왕시 | 보조금24, 복지로 | 강함 | `gov24-403000000123` |
| 248 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001638&bnefType=all&svcId=403000000105) | 출산가정에 출산장려금 지급 | 경기도 의왕시 | 보조금24, 복지로 | 강함 | `gov24-403000000105` |
| 249 | [x] | [출생·입양 신고세대 종량제봉투 무상지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2123706&bnefType=all&svcId=403000000157) | ○ 동 주민센터에서 출생·입양 신고시 종량제 봉투 무상지원 | 경기도 의왕시 | 보조금24 | 강함 | `gov24-403000000157` |
| 250 | [x] | [모자 건강증진 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001637&bnefType=all&svcId=403000000104) | 임산부에게 태아기형검사, 영양제 등 지원 | 경기도 의왕시 | 보조금24 | 후보 | `gov24-403000000104` |
| 251 | [ ] | [신혼부부 주택임차보증금 대출이자 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005027&wlfareInfoReldBztpCd=02) | 저출산 및 혼인기피 현상에 따른 사회문제 해소를 위한 무주택 신혼부부의 주택임차보증금 대출이자를 일부 지원하여 경제적 자립기반 마련 및 주거안정… | 경기도 의왕시 도시안전국 건축과 | 복지로 | 후보 | `bokjiro-wlf00005027` |
| 252 | [x] | [아이돌봄 신규 및 120시간 이용자 확대지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2110216&bnefType=all&svcId=403000000146) | 의왕시 아이돌봄서비스 신규 이용자 및 월 120시간 이상 이용자 서비스 비용 지원 | 경기도 의왕시 | 보조금24, 복지로 | 후보 | `gov24-403000000146` |
| 253 | [x] | [아픈아이 홈케어](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2110215&bnefType=all&svcId=403000000145) | 증빙서류 제출시, 아이돌봄서비스 이용요금(본인부담금) 일부 무료 지원. | 경기도 의왕시 | 보조금24, 복지로 | 후보 | `gov24-403000000145` |
| 254 | [ ] | [어린이집 공기청정기 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166217&bnefType=all&svcId=403000000167) | 실당 1대 지원하며 렌탈비 월 최대 22천원, 유지관리비 월 최대 130천원 지원 | 경기도 의왕시 | 보조금24 | 후보 | `gov24-403000000167` |
| 255 | [ ] | [어린이집 기자재 렌탈비 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2166318&bnefType=all&svcId=403000000168) | 어린이집 운영 및 보육 관련 기자재를 어린이집 1개소당 월 25,000원 한도로 지원 | 경기도 의왕시 | 보조금24 | 후보 | `gov24-403000000168` |
| 256 | [x] | [의왕시 상하수도 요금 감면(다자녀)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170719&bnefType=all&svcId=403000000184) | 상·하수도 요금감면: 동일 주소지로 된 세자녀 이상 가정 중 18세 이하 자녀가 있는 세대 | 경기도 의왕시 | 보조금24 | 후보 | `gov24-403000000184` |
| 257 | [ ] | [저소득층건강보험료지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001566&wlfareInfoReldBztpCd=02) | 건강보험료 납부에 어려움을 겪는 저소득 가구(장애인,한부모,만성질환)에 보험료지원 | 경기도 의왕시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00001566` |
| 258 | [x] | [파상풍 및 백일해 예방접종 사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170219&bnefType=all&svcId=403000000177) | 취약계층 및 65세 이상, 영유아 돌봄 대상자에게 파상풍 및 백일해 예방접종 제공 | 경기도 의왕시 | 보조금24 | 후보 | `gov24-403000000177` |

## 경기도 하남시 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 259 | [ ] | [산모·신생아 건강관리 지원(추가형)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005339&bnefType=all&svcId=404000000118) | 중위소득 150% 초과 출산가구에 산모신생아 건강관리 서비스 지원 | 경기도 하남시 | 보조금24 | 강함 | `gov24-404000000118` |
| 260 | [x] | [임산부 등록관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000633&bnefType=all&svcId=404000000104) | 임산부에게 산전검사, 영양제(엽산제,철분제) 제공, 유축기 대여 등 지원 | 경기도 하남시 | 보조금24 | 강함 | `gov24-404000000104` |
| 261 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001496&bnefType=all&svcId=404000000107) | 장애인가정에서 출산 시 출산지원금 지급 | 경기도 하남시 | 보조금24, 복지로 | 강함 | `gov24-404000000107` |
| 262 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001515&bnefType=all&svcId=404000000108) | 하남시 출산가정에 출산장려금을 현금으로 지원 | 경기도 하남시 | 보조금24, 복지로 | 강함 | `gov24-404000000108` |
| 263 | [ ] | [하남시 산후조리비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006348&wlfareInfoReldBztpCd=02) | 하남시 출산가정의 모자 건강증진을 도모하고 출산장려 분위기 조성 | 경기도 하남시 보건소 미사보건센터 | 복지로 | 강함 | `bokjiro-wlf00006348` |
| 264 | [x] | [건강한 신혼부부 가꾸기](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001808&bnefType=all&svcId=404000000111) | 신혼부부에게 임신전 건강검진 지원 | 경기도 하남시 | 보조금24 | 후보 | `gov24-404000000111` |
| 265 | [ ] | [노인 장수수당 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003943&bnefType=all&svcId=404000000114) | 하남시에 거주중인 장수 어르신에게 장수수당 지급 | 경기도 하남시 | 보조금24 | 후보 | `gov24-404000000114` |
| 266 | [ ] | [아동 치과주치의 의료지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000840&wlfareInfoReldBztpCd=02) | 저소득층 아동에게 포괄적 구강건강관리 서비스 제공으로 자가 구강관리능력을 향상시키고 구강건강 불평등을 해소하고자 함 | 경기도 하남시 보건소 건강증진과 | 복지로 | 후보 | `bokjiro-wlf00000840` |
| 267 | [ ] | [저소득 틈새계층 국민건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000859&wlfareInfoReldBztpCd=02) | 국민기초수급자가 아닌 저소득층(한부모가족세대, 장애인세대, 장기요양등급인정자세대)의 국민건강보험료를 지원하여 건강생활도모. | 경기도 하남시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00000859` |
| 268 | [x] | [하남시 아빠 육아휴직 장려금](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2133719&bnefType=all&svcId=404000000130) | 육아휴직을 한 남성근로자에 한해 월 30만원 최대 6개월 지원 | 경기도 하남시 | 보조금24 | 후보 | `gov24-404000000130` |

## 경기도 용인시 (18건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 269 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004059&bnefType=all&svcId=405000000645) | 출산가정에 산모신생아 건강관리 서비스 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000645` |
| 270 | [ ] | [용인시 난임부부 시술비 본인부담금 추가지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005467&wlfareInfoReldBztpCd=02) | 난임부부의 경제적 심리적 부담 경감 | 경기도 용인시 처인구보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00005467` |
| 271 | [ ] | [용인시 난임부부 시술비 약제비 지원 (기흥구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2121305&bnefType=all&svcId=405000000687) | 난임시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000687` |
| 272 | [ ] | [용인시 난임부부 시술비 약제비 지원(수지구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2121208&bnefType=all&svcId=405000000686) | 난임시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000686` |
| 273 | [x] | [용인시 난임부부 시술비 약제비 지원(처인구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2121109&bnefType=all&svcId=405000000685) | 난임시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000685` |
| 274 | [ ] | [용인시 난임부부 시술비 추가 지원 (기흥구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2115808&bnefType=all&svcId=405000000679) | ○ 난임부부 시술비 본인부담금 추가 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000679` |
| 275 | [ ] | [용인시 난임부부 시술비 추가 지원(수지구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2116209&bnefType=all&svcId=405000000680) | ○ 난임부부 시술비 본인부담금 추가 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000680` |
| 276 | [x] | [용인시 난임부부 시술비 추가 지원(처인구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2113206&bnefType=all&svcId=405000000675) | ○ 난임부부 시술비 본인부담금 추가 지원 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000675` |
| 277 | [x] | [용인시 임신지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2126401&bnefType=all&svcId=405000000689) | 용인시 주민등록을 두고 거주하는 20주 이상 임신부에게 태아 당 용인와이페이 30만원 지급 | 경기도 용인시 | 보조금24 | 강함 | `gov24-405000000689` |
| 278 | [x] | [용인시 장애인가정 출산지원금](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2110202&bnefType=all&svcId=405000000672) | 용인시 장애인가정 출산지원금 지급 | 경기도 용인시 | 보조금24, 복지로 | 강함 | `gov24-405000000672` |
| 279 | [x] | [용인시 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005864&bnefType=all&svcId=405000000655) | 출산부모에게 출산지원금 지급(신청일의 익월(다음 달) 25일 지급) | 경기도 용인시 | 보조금24, 복지로 | 강함 | `gov24-405000000655` |
| 280 | [ ] | [유축기 대여 서비스(기흥구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2108702&bnefType=all&svcId=405000000670) | 유축기 대여 서비스 제공 | 경기도 용인시 | 보조금24 | 후보 | `gov24-405000000670` |
| 281 | [ ] | [유축기 대여 서비스(수지구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2108501&bnefType=all&svcId=405000000669) | 신청기간 : 상시신청 접수기관 : 보건소 전화문의 : 031-6193-0876 | 경기도 용인시 | 보조금24 | 후보 | `gov24-405000000669` |
| 282 | [x] | [유축기 대여 서비스(처인구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2108801&bnefType=all&svcId=405000000671) | ○ 출산 후 1달 이내인 산모 대상 유축기 대여 지원 | 경기도 용인시 | 보조금24 | 후보 | `gov24-405000000671` |
| 283 | [ ] | [청각장애인 인공달팽이관 재활치료비](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000885&wlfareInfoReldBztpCd=02) | - 청각장애인 인공달팽이관 재활치료비 지원으로 의료비 부담 경감 및 사회·경제 활동 도모 | 경기도 용인시 복지여성국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000885` |
| 284 | [ ] | [취약계층 아동 입학준비금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001402&wlfareInfoReldBztpCd=02) | 법령에 의해 무상 지원되는 보육료 외에 어린이집에 부모가 추가로 부담하는 필요경비 일부 지원하여 취약계층 보육 부담 완화 및 보육지원 체감 만족… | 경기도 용인시 복지여성국 아동보육과 | 복지로 | 후보 | `bokjiro-wlf00001402` |
| 285 | [x] | [취약계층 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000002&bnefType=all&svcId=405000000628) | 어린이집을 이용하는 장애아 및 저소득층 영유아에게 입학준비금 지원 | 경기도 용인시 | 보조금24 | 후보 | `gov24-405000000628` |
| 286 | [ ] | [학대피해아동 그룹홈 생계비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004372&bnefType=all&svcId=405000000648) | 학대피해아동 쉼터에 생활비 지원 | 경기도 용인시 | 보조금24 | 후보 | `gov24-405000000648` |

## 경기도 파주시 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 287 | [x] | [모자보건사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001497&wlfareInfoReldBztpCd=02) | 모자보건 유지 및 증진 | 경기도 파주시 운정보건소 | 복지로 | 강함 | `bokjiro-wlf00001497` |
| 288 | [ ] | [산모·신생아 건강관리 지원(소득무관)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006377&bnefType=all&svcId=406000000127) | 출산가정에 산모신생아건강관리사 서비스 지원 | 경기도 파주시 | 보조금24 | 강함 | `gov24-406000000127` |
| 289 | [ ] | [산모신생아 건강관리사지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003882&wlfareInfoReldBztpCd=02) | - 출산가정에 건강관리사를 파견하여 산모의 산후회복과 신생아의 양육을 지원하고, 출산가정의 경제적 부담을 경감 - 산모신생아 건강관리사 양성을 … | 경기도 파주시 운정보건소 | 복지로 | 강함 | `bokjiro-wlf00003882` |
| 290 | [x] | [장애인가정 출산 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001593&wlfareInfoReldBztpCd=02) | 장애인 가정의 출산비용 지원을 통한 경제적 부담을 경감하고 출산 친화적인 문화 조성을 통한 삶의 질 개선&#13; | 경기도 파주시 복지정책국 노인장애인과 | 복지로 | 강함 | `bokjiro-wlf00001593` |
| 291 | [ ] | [출생축하 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001658&wlfareInfoReldBztpCd=02) | 출산율 저하 등 사회문제에 적극 대응하고 출산과 양육하기 좋은 환경에 기여하고자 자녀를 출산한 가정에 출생축하금을 지원하고자 함 | 경기도 파주시 복지정책국 여성가족과 | 복지로 | 강함 | `bokjiro-wlf00001658` |
| 292 | [x] | [출생축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000717&bnefType=all&svcId=406000000102) | 출산가구에 출생축하금을 직접 지급 | 경기도 파주시 | 보조금24 | 강함 | `gov24-406000000102` |
| 293 | [x] | [운정보건소 아이맘행복교실](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2169221&bnefType=all&svcId=406000000535) | 임산부대상(7종)/영유아대상(2종)/부부대상(1종) | 경기도 파주시 | 보조금24 | 후보 | `gov24-406000000535` |
| 294 | [ ] | [장수노인장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006116&bnefType=all&svcId=406000000126) | 고령장수노인 장려금 지급 | 경기도 파주시 | 보조금24 | 후보 | `gov24-406000000126` |
| 295 | [ ] | [청각장애인 인공달팽이관 재활치료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001570&wlfareInfoReldBztpCd=02) | 청각장애인 인공달팽이관 재활치료비 지원으로 의료비 부담 경감 사회·경제 활동 활성화 도모 | 경기도 파주시 복지정책국 노인장애인과 | 복지로 | 후보 | `bokjiro-wlf00001570` |
| 296 | [x] | [파주시 아빠 육아휴직 장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2172416&bnefType=all&svcId=406000000538) | 지급 기준을 모두 충족한 대상자에게 월 30만원씩 3개월 간 현금 지급(최대 90만원) | 경기도 파주시 | 보조금24, 복지로 | 후보 | `gov24-406000000538` |

## 경기도 이천시 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 297 | [x] | [산모신생아 건강관리 서비스 본인부담금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004727&wlfareInfoReldBztpCd=02) | 산모·신생아 건강관리 서비스 비용 중 본인부담금을 일부 지원하여 출산가정의 경제적 부담을 경감 산모·신생아 본인부담금 지원에 관한 거주 요건 완… | 경기도 이천시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00004727` |
| 298 | [x] | [이천시 1인 자영업자 등 출산급여 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170146&bnefType=all&svcId=407000000522) | 출산급여 90만원 지원(다태아의 경우 170만원 지원) -유·사산 산모의 경우 차등지원 | 경기도 이천시 | 보조금24, 복지로 | 강함 | `gov24-407000000522` |
| 299 | [x] | [이천시 난임부부 시술비 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2126801&bnefType=all&svcId=407000000518) | 난임시술과 직접적 관련이 있는 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 이천시 | 보조금24 | 강함 | `gov24-407000000518` |
| 300 | [x] | [이천시 난임부부 시술비 지원(추가 10% 지원)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2129317&bnefType=all&svcId=407000000520) | 이천시 난임부부 시술비 추가 지원 - 급여 부분 10% 지원 급여 전액 지원, 비급여 제외 | 경기도 이천시 | 보조금24 | 강함 | `gov24-407000000520` |
| 301 | [x] | [이천시 장애인가정 출산비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006017&wlfareInfoReldBztpCd=02) | 신생아를 출산한 장애인가정을 지원하여 신생아의 양육환경에 필요한 경제적 부담을 덜어줌으로써 안정적이고 건강한 가족생활 영위 및 출산친화적인 문화… | 경기도 이천시 복지국 노인장애인과 | 복지로 | 강함 | `bokjiro-wlf00006017` |
| 302 | [ ] | [입양아동 입학지원금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004612&wlfareInfoReldBztpCd=02) | 시 자체재원으로 입양아동 중 초·중·고등학교 입학아동에 대하여 입학지원금을 추가 지급하여 관내 입양을 장려하고 입양아동의 권익 및 복지를 증진하… | 경기도 이천시 복지환경국 청년아동과 | 복지로 | 강함 | `bokjiro-wlf00004612` |
| 303 | [ ] | [입양아동 입학지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000490&bnefType=all&svcId=407000000102) | 초,중,고등학교에 입학한 입양아동에게 입학지원금 지급 | 경기도 이천시 | 보조금24 | 강함 | `gov24-407000000102` |
| 304 | [x] | [출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006676&bnefType=all&svcId=407000000118) | 이천시 출산가정에 출산축하금 지급 | 경기도 이천시 | 보조금24 | 강함 | `gov24-407000000118` |
| 305 | [ ] | [신혼부부 주택 전월세자금 대출이자 지원 사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005188&wlfareInfoReldBztpCd=02) | 무주택 청년 신혼부부에게 주택전월세자금 대출이자를 일부 지원함으로써 주거비용 부담완화를 통해 안정된 주거 환경 및 결혼·출산 친화 환경을 조성하… | 경기도 이천시 복지환경국 청년아동과 | 복지로 | 후보 | `bokjiro-wlf00005188` |
| 306 | [x] | [이천시 다자녀(셋째이상) 가정 양육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001699&bnefType=all&svcId=407000000104) | 생후 12개월 이상 84개월 이하 셋째 이후 자녀를 위한 양육비 지원 | 경기도 이천시 | 보조금24 | 후보 | `gov24-407000000104` |
| 307 | [ ] | [퇴소 및 보호종결아동 자립정착금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005922&bnefType=all&svcId=407000000115) | 시설 및 가정위탁 종료아동에게 자립정착금 지원(1회) | 경기도 이천시 | 보조금24 | 후보 | `gov24-407000000115` |

## 경기도 안성시 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 308 | [ ] | [여성장애인 출산비용 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2190021&bnefType=all&svcId=408000000567) | 등록 여성장애인이 출산 시 출산지원금 지급 | 경기도 안성시 | 보조금24 | 강함 | `gov24-408000000567` |
| 309 | [x] | [임산부 건강관리 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001258&bnefType=all&svcId=408000000529) | 예비부모 및 임산부에게 엽산제와 철분제, 산전 혈액 검사 등 지원 | 경기도 안성시 | 보조금24 | 강함 | `gov24-408000000529` |
| 310 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004881&bnefType=all&svcId=408000000539) | 장애인가정이 출산 시 출산지원금 지급 | 경기도 안성시 | 보조금24, 복지로 | 강함 | `gov24-408000000539` |
| 311 | [ ] | [북한이탈주민 정착 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001256&bnefType=all&svcId=408000000527) | 북한이탈주민 자녀들에게 방문학습지 지원 | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000527` |
| 312 | [ ] | [아동공동생활가정 냉난방비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000313&bnefType=all&svcId=408000000521) | 아동생활시설에 난방비, 냉방비 지원 | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000521` |
| 313 | [ ] | [아이돌보미 건강증진비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005438&bnefType=all&svcId=408000000543) | 아이돌보미에게 인플루엔자 예방접종 및 건강검진비 지원 | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000543` |
| 314 | [x] | [안성 맞춤 가사 돌봄 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001391&bnefType=all&svcId=408000000533) | 맞벌이 등으로 인한 양육 공백 가정 및 고위험 임신부 등에게 가사돌봄 서비스 지원 | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000533` |
| 315 | [ ] | [안성시 저소득층 무상교통 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005491&wlfareInfoReldBztpCd=02) | 저소득층 안성시민의 이동권 보장 및 관내 대중교통 활성화와 지역경제 활성화 | 경기도 안성시 도시경제국 교통정책과 | 복지로 | 후보 | `bokjiro-wlf00005491` |
| 316 | [x] | [어린이집 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000489&bnefType=all&svcId=408000000522) | 생애최초 관내 어린이집에 입학한 영유아에게 입학준비금 지원(12개월 이내 사용) | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000522` |
| 317 | [ ] | [지역아동센터 냉난방비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2114344&bnefType=all&svcId=408000000561) | 지역아동센터에 냉난방비 지원 | 경기도 안성시 | 보조금24 | 후보 | `gov24-408000000561` |

## 경기도 김포시 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 318 | [x] | [산모신생아 건강관리사업 본인부담금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2127007&bnefType=all&svcId=409000000134) | 산모신생아 건강관리 지원 서비스 이용 본인부담금의 90퍼센트 지원 | 경기도 김포시 | 보조금24 | 강함 | `gov24-409000000134` |
| 319 | [ ] | [임신축하금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004512&wlfareInfoReldBztpCd=02) | 출산율 저하에 따른 사회문제에 적극 대처하고 출산 친화적 사회 분위기 조성을 위하여 김포시에 거주하는 임신,출산 가정에 임신축하금 지원 | 경기도 김포시 보건소 보건사업과 | 복지로 | 강함 | `bokjiro-wlf00004512` |
| 320 | [x] | [임신축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004283&bnefType=all&svcId=409000000104) | 임신부에게 임신축하금 지원 | 경기도 김포시 | 보조금24 | 강함 | `gov24-409000000104` |
| 321 | [ ] | [출산축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003973&wlfareInfoReldBztpCd=02) | 출산에 소요되는 경제적 부담경감 및 출산분위기 조성등에 필요한 사항을 규정함을 목적으로 한다. | 경기도 김포시 보건소 보건사업과 | 복지로 | 강함 | `bokjiro-wlf00003973` |
| 322 | [x] | [출산축하금 지원 (둘째자녀부터 적용)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005986&bnefType=all&svcId=409000000105) | 둘째아 이상 출산가정에 출산축하금 지원 | 경기도 김포시 | 보조금24 | 강함 | `gov24-409000000105` |
| 323 | [x] | [김포시 백일해 예방접종 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2186616&bnefType=all&svcId=409000000160) | 백일해 포함 백신(Tdap) 접종비 지원 | 경기도 김포시 | 보조금24 | 후보 | `gov24-409000000160` |
| 324 | [ ] | [김포청년 내일옷장](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=810127&bnefType=all&svcId=409000000116) | 김포청년 면접정장 무료 대여 | 경기도 김포시 | 보조금24 | 후보 | `gov24-409000000116` |
| 325 | [ ] | [북한이탈주민 자녀 학습비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170723&bnefType=all&svcId=409000000157) | ❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 - 학습지, 학원, 독서실 등 | 경기도 김포시 | 보조금24 | 후보 | `gov24-409000000157` |
| 326 | [ ] | [중증장애인 치과치료비 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000918&wlfareInfoReldBztpCd=02) | 중증장애인의 치과치료비를 지원하여 경제적인 부담을 완화하고 장애인의 삶의 질을 향상시켜 장애인가구의 생활안정을 도모 | 경기도 김포시 복지국 노인장애인과 | 복지로 | 후보 | `bokjiro-wlf00000918` |

## 경기도 화성시 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 327 | [x] | [(화성시 동탄구)난임부부 시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2144418&bnefType=all&svcId=553000000588) | ○난임 시술 약제비 지원 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000588` |
| 328 | [ ] | [(화성시 만세구) 난임부부 시술비 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2145916&bnefType=all&svcId=553000000590) | 난임시술 약제비 지원 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000590` |
| 329 | [ ] | [(화성시 병점구) 난임부부 시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2144516&bnefType=all&svcId=553000000589) | 난임부부 시술비 약제비 지원 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000589` |
| 330 | [ ] | [(화성시효행구)난임부부 시술 약제비 지원 신청](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2174416&bnefType=all&svcId=553000000591) | 난임시술 약제비 지원 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000591` |
| 331 | [ ] | [산모신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2116811&bnefType=all&svcId=553000000579) | 소득 및 출산유형에 따라 정부지원금 상이함 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000579` |
| 332 | [x] | [출산지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001716&bnefType=all&svcId=553000000114) | 출생 아동의 보호자 계좌로 현금 지급 | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000114` |
| 333 | [x] | [태아기형아 검사비 지원사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2117415&bnefType=all&svcId=553000000582) | 태아기형아 검사비 본인부담금 1인 최대 100,000원 지원(1,2차 검사비 합산) | 경기도 화성시 | 보조금24 | 강함 | `gov24-553000000582` |
| 334 | [ ] | [화성시 결혼·출산 기반자금 마련을 위한 매칭통장(결혼)](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006095&wlfareInfoReldBztpCd=02) | 시민과 지자체가 매칭하여 결혼 준비금을 공동으로 적립하는 방식으로 결혼 계획을 실행할 수 있도록 지원 | 경기도 화성시 성평등가족국 저출생대응과 | 복지로 | 강함 | `bokjiro-wlf00006095` |
| 335 | [ ] | [가정위탁아동 생필품비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006363&wlfareInfoReldBztpCd=02) | 가정위탁 가정의 경제적 양육 부담을 완화하고, 보호 대상 아동에게 기본적인 생활여건을 보장하여 건강한 성장과 정서적 안정을 도모함. | 경기도 화성시 복지국 아동친화과 | 복지로 | 후보 | `bokjiro-wlf00006363` |
| 336 | [ ] | [재해구호](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003706&wlfareInfoReldBztpCd=02) | 이재민 구호 | 경기도 화성시 시민복지국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00003706` |

## 경기도 광주시 (23건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 337 | [ ] | [다태임신 임산부 교통비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006471&wlfareInfoReldBztpCd=02) | 두 명 이상의 태아를 임신한 다태임신 임산부에게 교통비를 지원하여 신체적, 경제적 부담을 경감하고 건강한 출산을 지원하고자 함 | 경기도 광주시 보건소 오포건강생활지원센터 | 복지로 | 강함 | `bokjiro-wlf00006471` |
| 338 | [x] | [다태임신 임산부 교통비 지원(광주시)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168221&bnefType=all&svcId=554000000205) | 다둥이 임산부 산부인과 진료 시 소요되는 교통비 최대 50만원 지원 | 경기도 광주시 | 보조금24 | 강함 | `gov24-554000000205` |
| 339 | [x] | [산모·신생아 건강관리 서비스 본인부담금 지원(경기도 광주시)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104230&bnefType=all&svcId=554000000178) | 산모신생아 건강관리 서비스 이용 종료 가정에 선납부한 본인부담금 지원 | 경기도 광주시 | 보조금24 | 강함 | `gov24-554000000178` |
| 340 | [ ] | [산모·신생아 건강관리 지원(경기도 광주시)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004541&bnefType=all&svcId=554000000114) | 임산부에게 산모신생아 건강관리사 파견 지원 | 경기도 광주시 | 보조금24 | 강함 | `gov24-554000000114` |
| 341 | [ ] | [산모·신생아 건강관리 지원사업 본인부담금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005227&wlfareInfoReldBztpCd=02) | 출산가정에 산모·신생아 건강관리사를 파견하여 산모의 산후회복과 신생아의 양육을 지원하고, 출산가정의 경제적 부담을 경감하여 아이낳기 좋은 환경 … | 경기도 광주시 보건소 오포건강생활지원센터 | 복지로 | 강함 | `bokjiro-wlf00005227` |
| 342 | [ ] | [선천성 장애아 발견을 위한 기형아 검사비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006786&wlfareInfoReldBztpCd=02) | 기형아 검사비 지원을 통해 임신에 따른 경제적 부담을 경감하고 건강한 분만을 유도 | 경기도 광주시 보건소 오포건강생활지원센터 | 복지로 | 강함 | `bokjiro-wlf00006786` |
| 343 | [x] | [셋째이상 자녀 양육비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000366&bnefType=all&svcId=554000000103) | 셋째아 이상 출생아를 위해 12개월간 자녀 양육비 지원 | 경기도 광주시 | 보조금24, 복지로 | 강함 | `gov24-554000000103` |
| 344 | [x] | [임산부 물품 및 영양제(엽산제, 철분제) 택배발송(경기도 광주시)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001936&bnefType=all&svcId=554000000106) | 예비 신혼부부 및 임산부에게 엽산제와 철분제 지급 | 경기도 광주시 | 보조금24 | 강함 | `gov24-554000000106` |
| 345 | [ ] | [입양아동 입학지원금 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005679&wlfareInfoReldBztpCd=02) | 입양아동의 첫 입학을 축하하고 아동이 행복하고 건강하게 성장할 수 있는 환경을 조성하여 국내 입양 활성화를 도모하고자 함 | 경기도 광주시 복지문화국 아동보육과 | 복지로 | 강함 | `bokjiro-wlf00005679` |
| 346 | [ ] | [입양아동 입학지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2163417&bnefType=all&svcId=554000000189) | 입양아동의 초등학교 입학준비금 지원 | 경기도 광주시 | 보조금24 | 강함 | `gov24-554000000189` |
| 347 | [x] | [장애인가정 출산지원금 지급](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001937&bnefType=all&svcId=554000000107) | 장애인이 출산 시 출산지원금 지급 | 경기도 광주시 | 보조금24, 복지로 | 강함 | `gov24-554000000107` |
| 348 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005636&bnefType=all&svcId=554000000119) | 출산장려금 지원 | 경기도 광주시 | 보조금24, 복지로 | 강함 | `gov24-554000000119` |
| 349 | [ ] | [건강치아멘토링 아동치과주치의사업](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809702&bnefType=all&svcId=554000000122) | 관내 만 18세 미만 취약계층 아동 치과 진료비 지원(1인 최대 40만원) | 경기도 광주시 | 보조금24, 복지로 | 후보 | `gov24-554000000122` |
| 350 | [x] | [경기도 광주시 다자녀 가구 감면(상·하수도)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005265&bnefType=all&svcId=554000000115) | 3자녀 이상 다자녀가구에 가정용 수도요금 감면 지원 | 경기도 광주시 | 보조금24 | 후보 | `gov24-554000000115` |
| 351 | [ ] | [광주시 장애인휠체어 등 수리 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003403&wlfareInfoReldBztpCd=02) | 장애인의 이동을 위하여 사용하는 휠체어 등을 편리하고 안전하게 이용할 수 있도록 지원시책을 추진함으로써 장애인의 생활안정과 사회활동에 기여 | 경기도 광주시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00003403` |
| 352 | [x] | [기형아 검사비 지원(경기도 광주시)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=809738&bnefType=all&svcId=554000000131) | 기형아 검사 1, 2차 3만원 범위 내 지급 | 경기도 광주시 | 보조금24 | 후보 | `gov24-554000000131` |
| 353 | [ ] | [법정저소득층 입학준비금](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000285&wlfareInfoReldBztpCd=02) | 법정저소득층 영유아의 어린이집 입학준비금을 지원하는 맞춤형 보육서비스를 실시하여 소외계층에 대한 재정부담 경감 | 경기도 광주시 복지국 아동보육과 | 복지로 | 후보 | `bokjiro-wlf00000285` |
| 354 | [x] | [법정저소득층아동 어린이집 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004113&bnefType=all&svcId=554000000111) | 법정 저소득층 어린이집 이용아동의 입학준비금 지원 | 경기도 광주시 | 보조금24 | 후보 | `gov24-554000000111` |
| 355 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2161851&bnefType=all&svcId=554000000198) | 출산 후 유축기를 필요로 하는 광주시 주소지 산모를 대상으로 유축기 대여 서비스 제공 | 경기도 광주시 | 보조금24 | 후보 | `gov24-554000000198` |
| 356 | [ ] | [이재민 구호](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003044&wlfareInfoReldBztpCd=02) | 자연재해 발생시 이재민에게 생필품 등을 지원함으로써 이재민 구호와 생활안정에 기여함을 목적으로 함 | 경기도 광주시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00003044` |
| 357 | [ ] | [차상위계층 건강보험료 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003129&wlfareInfoReldBztpCd=02) | 한부모가족, 신체적 장애 등으로 인하여 생활에 어려움을 겪고 있는 차상위계층 이하의 사람에게 국민건강보험료를 지원함으로써 시민의 건강증진과 사회… | 경기도 광주시 복지문화국 복지정책과 | 복지로 | 후보 | `bokjiro-wlf00003129` |
| 358 | [ ] | [청각장애인 인공달팽이관 수술지원자 재활치료비 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000316&wlfareInfoReldBztpCd=02) | 청각장애인 인공달팽이관 수술 지원으로 의료비 부담 경감 및 사회,경제 활동 활성화를 도모하고자 함. | 경기도 광주시 복지국 장애인복지과 | 복지로 | 후보 | `bokjiro-wlf00000316` |
| 359 | [ ] | [퇴소아동 자립정착금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004043&bnefType=all&svcId=554000000110) | 보호종료된 아동에게 자립정착금 지급 | 경기도 광주시 | 보조금24 | 후보 | `gov24-554000000110` |

## 경기도 양주시 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 360 | [x] | [양주시 난임부부 원외처방 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2150343&bnefType=all&svcId=559000000434) | 난임 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부지원금액 한도 내에서 지원 | 경기도 양주시 | 보조금24 | 강함 | `gov24-559000000434` |
| 361 | [x] | [양주시 산후조리비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2150020&bnefType=all&svcId=559000000431) | 산후조리원 및 산모신생아 건강관리서비스 제공기관 이용 후 최대 50만원 현금지원 | 경기도 양주시 | 보조금24 | 강함 | `gov24-559000000431` |
| 362 | [x] | [양주시 출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003999&bnefType=all&svcId=559000000122) | 출생한 아이의 출산축하금 지원 | 경기도 양주시 | 보조금24, 복지로 | 강함 | `gov24-559000000122` |
| 363 | [x] | [입양아동 축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000719&bnefType=all&svcId=559000000105) | 입양가정에 입양축하금 지원 | 경기도 양주시 | 보조금24 | 강함 | `gov24-559000000105` |
| 364 | [x] | [장애인가정 출산비용지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003101&wlfareInfoReldBztpCd=02) | 장애인가정에 출산지원금을 지원하여 산모와 신생아의 건강과 양육환경을 향상시키고 저출산시대의 사회적 문제해소와 장애인가정의 생활안정 및 사회적 통… | 경기도 양주시 복지문화국 복지지원과 | 복지로 | 강함 | `bokjiro-wlf00003101` |
| 365 | [ ] | [양주시 청년창업 경진대회](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2167633&bnefType=all&svcId=559000000440) | 양주시장상 수여 및 창업지원금 총 19,000천원 지원 (3개팀) | 경기도 양주시 | 보조금24 | 후보 | `gov24-559000000440` |
| 366 | [x] | [유축기 대여 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004099&bnefType=all&svcId=559000000123) | 출산부에게 유축기 대여 | 경기도 양주시 | 보조금24 | 후보 | `gov24-559000000123` |
| 367 | [x] | [의료취약지역 소아청소년과 진료 아동 교통비 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006572&wlfareInfoReldBztpCd=02) | 관내 의료취약지역(읍·면지역) 거주 아동의 소아청소년과 진료를 위한 교통비를 지원하여 의료취약지역 아동의 건강권 보장 및 삶의 질 향상 도모 | 경기도 양주시 보건소 보건행정과 | 복지로 | 후보 | `bokjiro-wlf00006572` |
| 368 | [ ] | [청각장애인 인공달팽이관 재활치료](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001047&wlfareInfoReldBztpCd=02) | 청각장애인의 재활치료비 지원으로 삶의 질 향상 | 경기도 양주시 복지문화국 복지지원과 | 복지로 | 후보 | `bokjiro-wlf00001047` |

## 경기도 포천시 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 369 | [x] | [난임시술 약제비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2143318&bnefType=all&svcId=560000000142) | 난임부부의 난임시술비 지원 후 남은 금액 내에서 약제비 지원 | 경기도 포천시 | 보조금24 | 강함 | `gov24-560000000142` |
| 370 | [x] | [장애인가정 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001782&bnefType=all&svcId=560000000111) | 장애인가구 출산 시 출산지원금 지급 | 경기도 포천시 | 보조금24, 복지로 | 강함 | `gov24-560000000111` |
| 371 | [x] | [출생아 건강보험 가입지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003349&wlfareInfoReldBztpCd=02) | 우리 시 출생아에 대한 건강보험 가입 지원을 통해 육아 부담 경감 및 저출산 극복을 위한 사업입니다. | 경기도 포천시 문화복지국 가족여성과 | 복지로 | 강함 | `bokjiro-wlf00003349` |
| 372 | [x] | [포천시 출산축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004036&wlfareInfoReldBztpCd=02) | 출산 후 소요되는 비용의 경제적 부담을 지원하여 사회적 문제로 대두되고 있는 저출산 극복을 위한 출산 분위기를 조성하고자 하는 사업입니다. | 경기도 포천시 문화복지국 가족여성과 | 복지로 | 강함 | `bokjiro-wlf00004036` |
| 373 | [x] | [무상보육 3세 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006395&wlfareInfoReldBztpCd=02) | ❍ (사업목적) 현재 정부의 무상교육·보육 지원대상이 4~5세 유아로 한정되어 있어 2026년 지원에서 제외되는 3세 유아에게 포천시가 한시적으… | 경기도 포천시 인구성장국 교육정책과 | 복지로 | 후보 | `bokjiro-wlf00006395` |
| 374 | [ ] | [장수수당](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001272&bnefType=all&svcId=560000000105) | 포천시 주민등록을 둔 1943년 12월 31일 이전 출생한 노인에게 장수수당 지급 | 경기도 포천시 | 보조금24 | 후보 | `gov24-560000000105` |
| 375 | [x] | [포천시 다자녀가정 포천 쌀 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006804&wlfareInfoReldBztpCd=02) | 다자녀가정에 식료품(쌀)을 지원함으로써 경제적 부담 완화 뿐만 아니라, 다자녀 양육에 대한 긍정적인 환경을 조성할 수 있고, 지역 내 쌀 소비를… | 경기도 포천시 인구성장국 기획예산과 | 복지로 | 후보 | `bokjiro-wlf00006804` |
| 376 | [ ] | [포천시 청년·신혼부부 공공임대주택 주거비 지원(월 임대료)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2179119&bnefType=all&svcId=560000000144) | 관내 공공임대주택(송우파인빌, 포애뜰)에 거주하는 청년·신혼부부에게 주거비 지원 | 경기도 포천시 | 보조금24 | 후보 | `gov24-560000000144` |
| 377 | [ ] | [포천시 청년·신혼부부 공공임대주택 주거비 지원(임대보증금)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2168016&bnefType=all&svcId=560000000143) | 관내 공공임대주택(송우파인빌, 포천헤리센트)에 거주하는 청년·신혼부부에게 주거비 지원 | 경기도 포천시 | 보조금24 | 후보 | `gov24-560000000143` |

## 경기도 여주시 (11건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 378 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003563&bnefType=all&svcId=570000000118) | 임산부에게 산모신생아 건강관리 서비스 지원 | 경기도 여주시 | 보조금24 | 강함 | `gov24-570000000118` |
| 379 | [x] | [여성장애인 출산지원금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001291&bnefType=all&svcId=570000000105) | 출산한 여성장애인에게 출산지원금 지급 | 경기도 여주시 | 보조금24 | 강함 | `gov24-570000000105` |
| 380 | [x] | [여주 공공산후조리원 두자녀 이용료 감면 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006382&wlfareInfoReldBztpCd=02) | 저출산 대응을 위해 다자녀 기준이 완화됨에 따라, 둘째 자녀를 출산한 여주시 가정에게 경기여주 공공산후조리원 이용요금 감면 혜택을 지원하고자 함 | 경기도 여주시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00006382` |
| 381 | [x] | [여주시 난임부부 시술비 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00005948&wlfareInfoReldBztpCd=02) | 정부지원 범위(건강보험 및 도비보조금 지원 초과) 밖의 난임부부의 경제적 부담 경감 및 출산 의지 재고를 위하여 시술비 확대 지원 | 경기도 여주시 보건소 건강증진과 | 복지로 | 강함 | `bokjiro-wlf00005948` |
| 382 | [x] | [여주시 산후조리비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2128834&bnefType=all&svcId=570000000140) | 여주시 산모에게 출산·산후조리 관련 비용 지원 | 경기도 여주시 | 보조금24, 복지로 | 강함 | `gov24-570000000140` |
| 383 | [x] | [여주시 영유아 다자녀 가정 난방비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2170944&bnefType=all&svcId=570000000142) | 중위소득 150%이하 도시가스 미공급 영유아 다자녀(7세이하 2명이상)가정 난방비지원 | 경기도 여주시 | 보조금24 | 강함 | `gov24-570000000142` |
| 384 | [x] | [여주시 출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006114&bnefType=all&svcId=570000000125) | 출생아 또는 입양아 보호자에게 출산장려금 지원 | 경기도 여주시 | 보조금24, 복지로 | 강함 | `gov24-570000000125` |
| 385 | [ ] | [상수도요금 감면](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2001588&bnefType=all&svcId=O00008900001) | 사회 취약계층을 대상으로 수도요금 감면 서비스 제공 | 경기도 여주시 | 보조금24 | 후보 | `gov24-o00008900001` |
| 386 | [ ] | [여주시 다자녀 가정 입학축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003308&bnefType=all&svcId=570000000116) | 다자녀 가정에 초중고 입학축하금 지원 | 경기도 여주시 | 보조금24, 복지로 | 후보 | `gov24-570000000116` |
| 387 | [x] | [여주시 다자녀장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006522&bnefType=all&svcId=570000000126) | 둘째 이상 다자녀가정에 장려금 지원 | 경기도 여주시 | 보조금24, 복지로 | 후보 | `gov24-570000000126` |
| 388 | [x] | [여주시 아빠 육아휴직 장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001290&bnefType=all&svcId=570000000104) | 육아휴직 중인 남성근로자에게 장려금 지원 | 경기도 여주시 | 보조금24, 복지로 | 후보 | `gov24-570000000104` |

## 경기도 연천군 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 389 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1004376&bnefType=all&svcId=414000000109) | 출산가정에 산모신생아 건강관리 서비스 지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000109` |
| 390 | [x] | [신생아 출산용품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2160033&bnefType=all&svcId=414000000436) | 연천군 관내 출생아에게 신생아 출산용품을 지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000436` |
| 391 | [ ] | [외국인여성 출산가사 돌보미 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2118402&bnefType=all&svcId=414000000428) | 관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000428` |
| 392 | [x] | [임산부 등록 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2160035&bnefType=all&svcId=414000000438) | 관내 임산부에게 튼살크림 및 영양제 지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000438` |
| 393 | [x] | [임산부 산전검사(신혼부부검진)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1006146&bnefType=all&svcId=414000000117) | 신혼부부 임신 전 검사 및 임산부 산전검사 등 지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000117` |
| 394 | [x] | [출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2118401&bnefType=all&svcId=414000000427) | 연천군에 출생신고한 신생아와 180일이상 거주한 보호자에게 출산축하금지원 | 경기도 연천군 | 보조금24 | 강함 | `gov24-414000000427` |
| 395 | [ ] | [가정위탁아동 생계비 및 생필품 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001058&bnefType=all&svcId=414000000103) | 가정위탁아동을 위해 생계비 및 생필품비 지원 | 경기도 연천군 | 보조금24 | 후보 | `gov24-414000000103` |
| 396 | [ ] | [국공립 어린이집 시설개선공사](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2164717&bnefType=all&svcId=414000000457) | 국공립어린이집 시설개선 공사(개보수) | 경기도 연천군 | 보조금24 | 후보 | `gov24-414000000457` |
| 397 | [ ] | [어린이집 냉난방비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2165617&bnefType=all&svcId=414000000458) | 관내 어린이집 냉난방비 지원 | 경기도 연천군 | 보조금24 | 후보 | `gov24-414000000458` |
| 398 | [x] | [유축기 대여 서비스](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2160034&bnefType=all&svcId=414000000437) | 모유수유를 원하는 가정에 유축기를 대여 | 경기도 연천군 | 보조금24 | 후보 | `gov24-414000000437` |

## 경기도 가평군 (10건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 399 | [x] | [[가평군] 난임부부 시술비 약제비 지원(난임시술 이후 원외 약제비 청구)](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2179816&bnefType=all&svcId=416000000267) | 난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 지원 | 경기도 가평군 | 보조금24 | 강함 | `gov24-416000000267` |
| 400 | [x] | [가평군 혼인, 출산 축하물품 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006455&wlfareInfoReldBztpCd=02) | 가임기 여성 인구 유출과 인구 자연감소 현상이 심화되고 있는 지역 여건 상 초기 결혼·출산 단계에서 실질적 지원을 통해 지역 내 인구 유지 및 … | 경기도 가평군 기획예산담당관 | 복지로 | 강함 | `bokjiro-wlf00006455` |
| 401 | [ ] | [보육시설 영유아 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001338&wlfareInfoReldBztpCd=02) | 보육시설 영유아 급간식비, 민간가정어린이집 차량운영 지원, 민간가정어린이집 프로그램 운영 지원 보육시설 냉난방비 지원 어린이집 CCTV렌탈비 지… | 경기도 가평군 행정안전국 사회복지과 | 복지로 | 강함 | `bokjiro-wlf00001338` |
| 402 | [ ] | [자녀출산·입양축하금 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002609&wlfareInfoReldBztpCd=02) | 출산 및 입양에 따른 경제적 부담 감소 및 출산 및 입양 장려 | 경기도 가평군 행정안전국 사회복지과 | 복지로 | 강함 | `bokjiro-wlf00002609` |
| 403 | [x] | [출산축하금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1005104&bnefType=all&svcId=416000000117) | 출산부모에게 출산축하금 지원 | 경기도 가평군 | 보조금24 | 강함 | `gov24-416000000117` |
| 404 | [ ] | [치매환자 조호물품(기저귀) 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000206&bnefType=all&svcId=416000000101) | 치매환자에게 연 한도 내의 조호물품 제공 | 경기도 가평군 | 보조금24 | 강함 | `gov24-416000000101` |
| 405 | [ ] | [가평군 신혼부부 주거자금 대출이자 지원사업](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004881&wlfareInfoReldBztpCd=02) | 주택마련 비용 부담을 경감하여 결혼 결정에 긍정적인 영향을 주고, 주거비 부담 완화를 통한 출산여건 개선으로, 출생아수 감소 등 초저출산시대에 … | 경기도 가평군 기획예산담당관 | 복지로 | 후보 | `bokjiro-wlf00004881` |
| 406 | [x] | [아이돌봄서비스 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002656&wlfareInfoReldBztpCd=02) | 맞벌이 등 양육공백 가정에 방문 돌봄 서비스를 제공하는 '아이돌봄서비스'의 이용자 본인부담금을 군비로 지원하여 양육부담을 경감하고 건강한 양육 … | 경기도 가평군 행정안전국 사회복지과 | 복지로 | 후보 | `bokjiro-wlf00002656` |
| 407 | [ ] | [전입세대 환영물품 지급](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00006454&wlfareInfoReldBztpCd=02) | 저출산·고령화 심화에 따라 인구감소 문제가 대두됨에 따라 전입 세대에 환영 물품을 제공하여 공동체 소속감과 지역 유대감을 형성하여 전입 초기 적… | 경기도 가평군 기획예산담당관 | 복지로 | 후보 | `bokjiro-wlf00006454` |
| 408 | [ ] | [화장장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1002139&bnefType=all&svcId=416000000109) | 가평군에 주민등록이 되어 있는 사람이 사망한 경우, 화장하여 장례를 치른 연고자에게 지급 | 경기도 가평군 | 보조금24 | 후보 | `gov24-416000000109` |

## 경기도 양평군 (9건)

| # | 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |
|---|---|---|---|---|---|---|---|
| 409 | [ ] | [산모·신생아 건강관리 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1003834&bnefType=all&svcId=417000000121) | 임산부에게 산모신생아 건강관리 서비스 지원 | 경기도 양평군 | 보조금24 | 강함 | `gov24-417000000121` |
| 410 | [x] | [양평군 산후조리비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2109509&bnefType=all&svcId=417000000145) | 양평군에 거주하는 출산가정에게 양평군 산후조리비 지원 | 경기도 양평군 | 보조금24, 복지로 | 강함 | `gov24-417000000145` |
| 411 | [x] | [임산부 엽산제 및 철분제 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001281&bnefType=all&svcId=417000000111) | 예비부부 및 임산부 등에게 엽산제와 철분제 지원 | 경기도 양평군 | 보조금24 | 강함 | `gov24-417000000111` |
| 412 | [x] | [출산장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001282&bnefType=all&svcId=417000000112) | 출산부모에게 출산장려금 지원 | 경기도 양평군 | 보조금24 | 강함 | `gov24-417000000112` |
| 413 | [x] | [아빠육아휴직 장려금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=2104528&bnefType=all&svcId=417000000144) | 아빠육아휴직 장려금 지원(월50만원이내/최대6개월) | 경기도 양평군 | 보조금24 | 후보 | `gov24-417000000144` |
| 414 | [ ] | [장수수당](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1001271&bnefType=all&svcId=417000000105) | 장수노인에게 장수수당 지급 | 경기도 양평군 | 보조금24 | 후보 | `gov24-417000000105` |
| 415 | [x] | [저소득 및 다문화가정 아동 입학준비금 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=1000045&bnefType=all&svcId=417000000101) | 어린이집에 입학하는 관내 거주 저소득 및 다문화 가정의 아동에게 입학준비금 지원 | 경기도 양평군 | 보조금24, 복지로 | 후보 | `gov24-417000000101` |
| 416 | [ ] | [저소득 한부모가정 지원](https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00002629&wlfareInfoReldBztpCd=02) | 한부모가족이 건강하고 문화적인 생활을 영위할 수 있도록 함으로써 한부모 가족의 생활안정 및 복지증진에 이바지함을 목적으로 함 | 경기도 양평군 문화복지국 가족복지과 | 복지로 | 후보 | `bokjiro-wlf00002629` |
| 417 | [ ] | [취약계층 알레르기질환 의료비 지원](https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=806051&bnefType=all&svcId=417000000136) | 알레르기질환(아토피피부염, 알레르기비염, 천식)치료에 소요되는 비용중 연20만원 한도 | 경기도 양평군 | 보조금24 | 후보 | `gov24-417000000136` |


## 제외한 항목

### 경기도 사업을 시·군에서 접수만 받음 (9건)

- 170. 산모 신생아 건강관리 서비스(확대) (`gov24-397000000110`): 원문 "기준중위소득 150%초과 출산가정". 경기도 추가형(6번)과 같은 사업
- 187. 산모·신생아 건강관리 지원(자체사업) (`gov24-398000000111`): 원문 "관내 기준중위소득 150%초과 출산가정". 이름은 "자체사업"이지만 경기도 추가형(6번)과 같은 대상·내용
- 199. 남양주시 산후조리비 지원 (`bokjiro-wlf00005268`): 경기도 산후조리비(2번)를 시에서 받는 것으로 보임. 복지로 요약뿐이고, 같은 이름의 시흥시판 원문은 경기도판과 문구가 같음
- 200. 산모·신생아 건강관리 지원(추가형) (`gov24-399000000112`): 경기도 추가형(6번)과 같은 사업
- 212. 산모 · 신생아 건강관리 지원 서비스(확대) (`gov24-400000000115`): 원문 "기준중위소득 150%초과 출산가구". 경기도 추가형(6번)과 같은 사업
- 222. 시흥시 산후조리비 지원 (`gov24-401000000489`): 원문 "출생아 1인당 지역화폐 50만원"이 경기도 산후조리비(2번)와 같은 문구
- 259. 산모·신생아 건강관리 지원(추가형) (`gov24-404000000118`): 원문 "중위소득 150% 초과 출산가구". 경기도 추가형(6번)과 같은 사업
- 263. 하남시 산후조리비 지원 (`bokjiro-wlf00006348`): 경기도 산후조리비(2번)를 시에서 받는 것으로 보임 (복지로 요약뿐)
- 288. 산모·신생아 건강관리 지원(소득무관) (`gov24-406000000127`): 원문 "파주시 거주 출산가정(소득무관)" 건강관리사 방문. 전국 사업과 경기도 추가형(6번)을 합친 것

### 아이·출산과 관계없는 일반 대상 (67건)

- 13. 경기도 체육인 기회소득 (`gov24-641000000704`): 체육인 기회소득
- 19. 아동안전지킴이 활동비 지원 (`gov24-641000000859`): 아동안전지킴이 활동비 (활동하는 사람 대상)
- 20. 장애인맞춤형지원사 (`gov24-641000000116`): 저소득 장애인 생활지원
- 21. 저소득층 청각장애인 재활지원 (`bokjiro-wlf00000720`): 저소득 청각장애인
- 22. 청각장애인 인공달팽이관 수술지원 (`gov24-641000000149`): 청각장애인 인공달팽이관 수술
- 42. (수원시 영통구) 아토피·천식 예방관리 서비스 (`gov24-374000000592`): 아토피·천식 예방관리 (알레르기 질환 전체)
- 47. 수원시 아동담당의 의료지원 사업 (`bokjiro-wlf00001375`): 취약계층 아동 의료지원 (나이 범위 없음, 복지로 요약뿐)
- 60. 성남시 노동취약계층 유급병가비 지원 (`gov24-378000000164`): 노동취약계층 유급병가비
- 64. 수급자, 저소득층 특수촬영비 지원 (`bokjiro-wlf00001569`): 수급자 특수촬영비
- 67. 저소득가구 전세임대 지원 (`bokjiro-wlf00001276`): 저소득가구 전세임대
- 68. 저소득세대 건강보험료 지원 (`bokjiro-wlf00000710`): 저소득세대 건강보험료
- 69. 저소득중증청각장애인재활치료비지원 (`bokjiro-wlf00001297`): 저소득 중증청각장애인 재활치료비
- 70. 중증장애인 사회적응활동 지원 (`bokjiro-wlf00001298`): 중증장애인 사회적응활동
- 75. 의사상자 특별위로금 (`bokjiro-wlf00001404`): 의사상자 특별위로금
- 107. 저소득 장애인 지원(인공달팽이관 수술자 재활치료비) (`bokjiro-wlf00001199`): 저소득 장애인 인공달팽이관 재활치료비
- 122. 저소득장애인 생활안정지원 사업(청각장애아동 인공달팽이관 재활치료) (`bokjiro-wlf00001472`): 청각장애아동 인공달팽이관 재활치료
- 128. 치매환자 조호물품 지원(기저귀, 위생매트 등) (`gov24-391000000128`): 치매환자 조호물품
- 145. 신혼부부 및 청년 전월세 보증금 대출이자 지원사업 계획 (`bokjiro-wlf00006089`): 신혼부부·청년 전월세 대출이자 (아이 조건 없음)
- 146. 행려자 보호 (`bokjiro-wlf00002597`): 행려자 보호
- 167. 저소득층 청각장애인 재활지원 (`bokjiro-wlf00001417`): 저소득층 청각장애인 재활
- 178. 교통약자이동지원센터 운영 (`bokjiro-wlf00000974`): 교통약자 이동지원
- 179. 국민기초생활 보장지원(월동난방비, 대학생전공교재비, 이사비용, 쓰레기봉투비, 진단서 발급비용) (`bokjiro-wlf00001491`): 기초생활수급자 지원
- 182. 신혼부부 주택전세자금 대출이자 지원 (`bokjiro-wlf00001512`): 신혼부부 전세자금 대출이자 (아이 조건 없음)
- 184. 화장장려금 지원 (`gov24-397000000134`): 화장장려금
- 197. 저소득장애인주거환경 개선 사업 (`bokjiro-wlf00000996`): 저소득장애인 주거환경 개선
- 198. 차상위계층 건강보험료 지원 (`bokjiro-wlf00003555`): 차상위계층 건강보험료
- 202. 중풍 ‧ 와상 노인 생활용품 지원(기저귀) (`gov24-399000000107`): 중풍·와상 노인 기저귀
- 207. 청각장애인 인공달팽이관 재활치료비 지원 (`bokjiro-wlf00001016`): 청각장애인 인공달팽이관 재활치료비
- 214. 공공치료기관 이용 아동 재활치료비 지원 (`bokjiro-wlf00001909`): 공공치료기관 이용 아동 재활치료비 (복지로 요약뿐, 특정 치료 대상)
- 217. 오산시 청년 및 신혼부부 주택임차 보증금 대출이자 지원사업 (`bokjiro-wlf00006191`): 청년·신혼부부 주택임차 대출이자 (아이 조건 없음)
- 219. 저소득 한부모가정 지원 (연료비) (`bokjiro-wlf00003789`): 저소득 한부모가정 연료비
- 220. 중증장애인 택시요금 할인카드 지원 (`bokjiro-wlf00002994`): 중증장애인 택시요금 할인
- 221. 청각장애아동재활치료비 (`bokjiro-wlf00003763`): 청각장애아동 재활치료비 (서울 소아 1형 당뇨와 같은 판단: 특정 질환 대상)
- 225. 시흥형 주거비(아동 주거비) 지원 (`gov24-401000000104`): 저소득 무주택 월세가구 주거비 (아동은 가산만)
- 226. 신혼부부 전세대출금 이자지원 사업 (`bokjiro-wlf00005461`): 신혼부부 전세대출금 이자 (아이 조건 없음)
- 230. 장애인 재활프로그램 (`bokjiro-wlf00003822`): 장애인 재활프로그램
- 231. 장애인보장구수리센터운영 (`bokjiro-wlf00000810`): 장애인 보장구 수리
- 232. 장애인특별운송사업 (`bokjiro-wlf00001372`): 장애인 특별운송
- 251. 신혼부부 주택임차보증금 대출이자 지원사업 (`bokjiro-wlf00005027`): 신혼부부 주택임차보증금 대출이자 (아이 조건 없음)
- 257. 저소득층건강보험료지원 (`bokjiro-wlf00001566`): 저소득층 건강보험료
- 265. 노인 장수수당 지원 (`gov24-404000000114`): 노인 장수수당
- 267. 저소득 틈새계층 국민건강보험료 지원 (`bokjiro-wlf00000859`): 저소득 틈새계층 건강보험료
- 283. 청각장애인 인공달팽이관 재활치료비 (`bokjiro-wlf00000885`): 청각장애인 인공달팽이관 재활치료비
- 294. 장수노인장려금 지원 (`gov24-406000000126`): 장수노인 장려금
- 295. 청각장애인 인공달팽이관 재활치료 지원 (`bokjiro-wlf00001570`): 청각장애인 인공달팽이관 재활치료
- 305. 신혼부부 주택 전월세자금 대출이자 지원 사업 (`bokjiro-wlf00005188`): 신혼부부 전월세자금 대출이자 (아이 조건 없음)
- 311. 북한이탈주민 정착 지원사업 (`gov24-408000000527`): 북한이탈주민 정착 지원
- 315. 안성시 저소득층 무상교통 지원사업 (`bokjiro-wlf00005491`): 저소득층 무상교통
- 325. 북한이탈주민 자녀 학습비 지원 (`gov24-409000000157`): 북한이탈주민 자녀 학습비
- 326. 중증장애인 치과치료비 지원사업 (`bokjiro-wlf00000918`): 중증장애인 치과치료비
- 334. 화성시 결혼·출산 기반자금 마련을 위한 매칭통장(결혼) (`bokjiro-wlf00006095`): 결혼 준비 매칭통장
- 336. 재해구호 (`bokjiro-wlf00003706`): 재해구호
- 351. 광주시 장애인휠체어 등 수리 지원 (`bokjiro-wlf00003403`): 장애인 휠체어 수리
- 356. 이재민 구호 (`bokjiro-wlf00003044`): 이재민 구호
- 357. 차상위계층 건강보험료 지원 (`bokjiro-wlf00003129`): 차상위계층 건강보험료
- 358. 청각장애인 인공달팽이관 수술지원자 재활치료비 지원 (`bokjiro-wlf00000316`): 청각장애인 인공달팽이관 재활치료비
- 368. 청각장애인 인공달팽이관 재활치료 (`bokjiro-wlf00001047`): 청각장애인 인공달팽이관 재활치료
- 374. 장수수당 (`gov24-560000000105`): 장수수당
- 376. 포천시 청년·신혼부부 공공임대주택 주거비 지원(월 임대료) (`gov24-560000000144`): 청년·신혼부부 공공임대 월 임대료 (아이 조건 없음)
- 377. 포천시 청년·신혼부부 공공임대주택 주거비 지원(임대보증금) (`gov24-560000000143`): 청년·신혼부부 공공임대 보증금 (아이 조건 없음)
- 404. 치매환자 조호물품(기저귀) 지원 (`gov24-416000000101`): 치매환자 기저귀
- 405. 가평군 신혼부부 주거자금 대출이자 지원사업 (`bokjiro-wlf00004881`): 신혼부부 주거자금 대출이자 (아이 조건 없음)
- 407. 전입세대 환영물품 지급 (`bokjiro-wlf00006454`): 전입세대 환영물품
- 408. 화장장려금 지원 (`gov24-416000000109`): 화장장려금
- 414. 장수수당 (`gov24-417000000105`): 장수수당
- 416. 저소득 한부모가정 지원 (`bokjiro-wlf00002629`): 저소득 한부모가정 일반 지원 (복지로 요약뿐)
- 417. 취약계층 알레르기질환 의료비 지원 (`gov24-417000000136`): 취약계층 알레르기질환 의료비 (특정 질환 대상)

### 부모가 신청하는 혜택이 아님 (기관·시설 대상, 감면 규정) (15건)

- 94. 안양시 공공체육시설 사용료 감면 (`gov24-383000000190`): 공공체육시설 사용료 감면 규정
- 95. 어린이집 공기청정기 지원 (`gov24-383000000176`): 어린이집 공기청정기 (기관 대상)
- 97. 어린이집 전기레인지 지원 (`gov24-383000000180`): 어린이집 전기레인지 (기관 대상)
- 166. 상수도요금감면(기초생활수급자,국가(독립)유공자,어린이집,유치원,사회복지시설,다문화가정,한부모가정,다자녀가정) (`bokjiro-wlf00003929`): 상수도요금 감면 규정 (수급자·유공자·어린이집·다자녀 등 대상별)
- 223. 출생 미등록 아동 발굴 및 지원 사업 (`gov24-401000000484`): 출생 등록을 못 한 18세 미만 아동 확인증 발급과 사례관리
- 254. 어린이집 공기청정기 지원사업 (`gov24-403000000167`): 어린이집 공기청정기 (기관 대상)
- 255. 어린이집 기자재 렌탈비 지원사업 (`gov24-403000000168`): 어린이집 기자재 렌탈비 (기관 대상)
- 286. 학대피해아동 그룹홈 생계비 지원 (`gov24-405000000648`): 학대피해아동 그룹홈 생계비 (시설 대상)
- 312. 아동공동생활가정 냉난방비 지원 (`gov24-408000000521`): 아동공동생활가정 냉난방비 (시설 대상)
- 313. 아이돌보미 건강증진비 지원 (`gov24-408000000543`): 아이돌보미 종사자 건강증진비
- 317. 지역아동센터 냉난방비 지원 (`gov24-408000000561`): 지역아동센터 냉난방비 (시설 대상)
- 385. 상수도요금 감면 (`gov24-o00008900001`): 상수도요금 감면 규정 (한부모·수급자·장애인·다자녀 등 대상별)
- 396. 국공립 어린이집 시설개선공사 (`gov24-414000000457`): 국공립 어린이집 시설개선 (기관 대상)
- 397. 어린이집 냉난방비 지원 (`gov24-414000000458`): 어린이집 냉난방비 (기관 대상)
- 401. 보육시설 영유아 지원 (`bokjiro-wlf00001338`): 어린이집 급간식비·차량·냉난방비·CCTV 등 (기관 대상)

### 임신·영유아와 거리가 멂 (가정위탁·학대피해·학령기·청소년·청년) (43건)

- 11. 가정위탁 양육지원 (`bokjiro-wlf00000686`): 가정위탁 양육보조금
- 12. 결식아동급식지원 (`gov24-641000000171`): 결식우려아동 급식
- 14. 경기도 한부모가족복지시설 퇴소자 자립지원금 지원 (`bokjiro-wlf00003288`): 한부모가족복지시설 퇴소자 자립지원금
- 15. 고난이도 보호대상아동 맞춤형사례관리 (`bokjiro-wlf00006204`): 보호대상아동 사례관리
- 61. 성남시 다자녀가구 대학생 등록금 지원 (`gov24-378000000167`): 다자녀가구 대학생 등록금
- 71. 학대피해아동 의료비 등 지원 (`gov24-378000000163`): 학대피해아동 의료비
- 82. 입양아동 입학준비금 지원 (`gov24-383000000111`): 입양아동 초중고 입학준비금
- 87. 2026년 청년 어학·자격시험 응시료 지원 (`gov24-383000000209`): 청년 어학·자격시험 응시료
- 88. 가정위탁 아동지원 (`bokjiro-wlf00001040`): 가정위탁 아동지원
- 104. 부천시 취약계층 아동치과주치의사업 (`gov24-386000000147`): 취약계층 아동 치과주치의 (서울 아동치과치료와 같은 판단)
- 108. 초등학생 입학준비금 지원 (`bokjiro-wlf00006399`): 초등학생 입학준비금
- 117. 광명시 저소득층 아동 치과주치의 의료지원사업 (`bokjiro-wlf00001448`): 저소득층 아동 치과주치의
- 118. 시설퇴소 및 가정위탁종결아동 자립정착금 지급 (`gov24-390000000108`): 시설퇴소·가정위탁종결 아동 자립정착금
- 123. 저소득층 아동 치과치료비 지원 (`gov24-390000000116`): 저소득층 아동 치과치료비
- 131. 가정위탁 양육보조금 지원 (`gov24-391000000138`): 가정위탁 양육보조금
- 132. 가정위탁아동 학습활동 지원 (`gov24-391000000111`): 가정위탁아동 학습활동
- 133. 결식아동 휴일급식 지원 사업 (`gov24-391000000119`): 결식아동 휴일급식
- 134. 보호종료아동 자립수당 (`gov24-391000000113`): 보호종료아동 자립수당
- 136. 퇴소 및 보호종결아동 자립정착금 지원 (`gov24-391000000103`): 퇴소·보호종결아동 자립정착금
- 137. 평택시 청년 월세 지원 (`gov24-391000000144`): 청년 월세
- 142. 강남구청 인터넷수능방송 수강료 지원 (`gov24-392000000164`): 인터넷수능방송 수강료
- 153. 다자녀 학자금 지원 (`gov24-393000000104`): 다자녀 고등학교 공납금·대학 학자금
- 173. 입양아동 양육수당 (`gov24-397000000121`): 만 18세~19세 미만 입양아동 양육수당
- 181. 다자녀 양육바우처 지원 (`gov24-397000000140`): 8세 이상 13세 미만 다자녀 양육바우처
- 189. 입양아동 입학축하금 지원 (`gov24-398000000119`): 입양아동 초중고 입학축하금
- 192. 가정위탁아동 능력개발비 지원 (`gov24-398000000104`): 가정위탁아동 능력개발비
- 204. 가정위탁 아동 능력개발비 지원 (`gov24-399000000111`): 가정위탁아동 학원비
- 218. 저소득 한부모가정 아동발달 지원계좌 지원 (`bokjiro-wlf00003788`): 저소득 한부모가정 아동발달 지원계좌 (자립 준비 저축)
- 228. 유기 및 위기아동지원 (`bokjiro-wlf00000809`): 유기·위기아동 지원
- 239. 청년날개 면접정장 무료대여 (`gov24-402000000130`): 청년 면접정장 대여
- 266. 아동 치과주치의 의료지원 사업 (`bokjiro-wlf00000840`): 저소득층 아동 치과주치의
- 302. 입양아동 입학지원금 지급 (`bokjiro-wlf00004612`): 입양아동 초중고 입학지원금
- 303. 입양아동 입학지원금 지원 (`gov24-407000000102`): 입양아동 초중고 입학지원금
- 307. 퇴소 및 보호종결아동 자립정착금 지원 (`gov24-407000000115`): 퇴소·보호종결아동 자립정착금
- 324. 김포청년 내일옷장 (`gov24-409000000116`): 청년 면접정장 대여
- 335. 가정위탁아동 생필품비 지원 (`bokjiro-wlf00006363`): 가정위탁아동 생필품비
- 345. 입양아동 입학지원금 지급 (`bokjiro-wlf00005679`): 입양아동 초등 입학지원금
- 346. 입양아동 입학지원금 지원 (`gov24-554000000189`): 입양아동 초등 입학지원금
- 349. 건강치아멘토링 아동치과주치의사업 (`gov24-554000000122`): 아동 치과주치의
- 359. 퇴소아동 자립정착금 지원 (`gov24-554000000110`): 퇴소아동 자립정착금
- 365. 양주시 청년창업 경진대회 (`gov24-559000000440`): 청년창업 경진대회
- 386. 여주시 다자녀 가정 입학축하금 지원 (`gov24-570000000116`): 원문 "초·중·고 입학 자녀 1인당 입학축하금"
- 395. 가정위탁아동 생계비 및 생필품 지원 (`gov24-414000000103`): 가정위탁아동 생계비

### 전국 혜택과 같은 사업 (16건)

- 23. 한부모가족 아동양육비 지원 (`bokjiro-wlf00005606`): 전국 "한부모가족 아동양육비 지원"과 같은 사업
- 49. 산모·신생아 건강관리 서비스 제공 (`gov24-378000000153`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 74. 국가예방접종 지원 (`gov24-382000000139`): 국가예방접종을 시에서 하는 것. 전국 카드에 국가예방접종이 아직 없음
- 76. 산모·신생아 건강관리 지원 (`gov24-383000000101`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견, 서비스 비용 일부 지원)과 같은 사업
- 121. 저소득 장애인 생활안정 지원 (`gov24-390000000115`): 원문 "여성장애인 출산금 지원 : 120만원(1회)". 전국 "여성장애인 출산비용지원"과 같은 사업
- 126. 장애아동 입양 양육보조금 지원 (`gov24-391000000116`): 원문 금액(월 72.1만원/63.4만원)이 전국 "장애아동입양 양육보조금"과 같음
- 159. 산모·신생아 건강관리 지원 (`gov24-394000000113`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 165. 고양시 한시적 양육비 지원 (`bokjiro-wlf00004191`): 양육비 채권자 한시적 양육비. 전국 "양육비 선지급"과 같은 성격
- 269. 산모·신생아 건강관리 지원 (`gov24-405000000645`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 289. 산모신생아 건강관리사지원 (`bokjiro-wlf00003882`): 건강관리사 파견. 전국 "산모·신생아 건강관리 지원"과 같은 사업
- 308. 여성장애인 출산비용 지원 (`gov24-408000000567`): 원문 "태아 1인 기준 120만원". 전국 "여성장애인 출산비용지원"과 같은 사업
- 331. 산모신생아 건강관리 지원 (`gov24-553000000579`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 340. 산모·신생아 건강관리 지원(경기도 광주시) (`gov24-554000000114`): 전국 "산모·신생아 건강관리 지원"(건강관리사 파견)과 같은 사업
- 378. 산모·신생아 건강관리 지원 (`gov24-570000000118`): 전국 "산모·신생아 건강관리 지원"과 같은 사업
- 389. 산모·신생아 건강관리 지원 (`gov24-414000000109`): 전국 "산모·신생아 건강관리 지원" 바우처와 같은 사업
- 409. 산모·신생아 건강관리 지원 (`gov24-417000000121`): 원문 "기준중위소득 150% 이하" 건강관리사 바우처. 전국 "산모·신생아 건강관리 지원"과 같은 사업

### 다문화가족·외국인 전용 (이번 범위 밖) (5건)

- 18. 미등록 이주배경아동 보육지원금(어린이집 직접지원) (`bokjiro-wlf00006773`): 미등록 이주배경아동
- 105. 외국인 아동(누리3~5세) 보육료 지원 (`gov24-386000000118`): 외국인 아동 보육료
- 227. 외국인아동보육료 지원 (`gov24-401000000110`): 외국인아동 보육료
- 238. 외국인자녀 보육료 추가 지원 (`gov24-402000000111`): 외국인자녀 보육료
- 391. 외국인여성 출산가사 돌보미 지원 (`gov24-414000000428`): 외국인여성 출산가사 돌보미

## 합친 원본 (대표 카드의 두 번째 원본, 67건)

- 1. 경기도 산후조리비 지원 (`bokjiro-wlf00001361`) → 2번 경기도산후조리비지원
- 3. 경기임산부 친환경농산물 지원 (`bokjiro-wlf00006099`) → 8번 임산부 친환경농산물 공급지원
- 7. 산모신생아 건강관리사 지원 확대 (`bokjiro-wlf00001022`) → 6번 산모 신생아 건강관리 지원사업(추가형)
- 9. 한방난임 지원 사업 (`bokjiro-wlf00003476`) → 10번 한방난임사업 지원
- 26. (수원시 영통구) 임산부 및 예비·신혼부부 검사 지원 (`gov24-374000000575`) → 24번 (수원시 권선구) 임산부 및 예비·신혼부부 검사 지원
- 27. (수원시 영통구) 임산부 우울 선별검사 지원 (`gov24-374000000579`) → 25번 (수원시 권선구) 임산부 우울 선별검사 지원
- 28. (수원시 장안구) 임산부 및 예비·신혼부부 검사 지원 (`gov24-374000000572`) → 24번 (수원시 권선구) 임산부 및 예비·신혼부부 검사 지원
- 29. (수원시 장안구) 임산부 우울 선별검사 지원 (`gov24-374000000576`) → 25번 (수원시 권선구) 임산부 우울 선별검사 지원
- 30. (수원시 팔달구) 임산부 및 예비·신혼부부 검사 지원 (`gov24-374000000574`) → 24번 (수원시 권선구) 임산부 및 예비·신혼부부 검사 지원
- 31. (수원시 팔달구) 임산부 우울 선별검사 지원 (`gov24-374000000578`) → 25번 (수원시 권선구) 임산부 우울 선별검사 지원
- 34. 수원시 난임부부 원외처방 약제비 지원(영통구) (`gov24-374000000558`) → 33번 수원시 난임부부 원외처방 약제비 지원(권선구)
- 35. 수원시 난임부부 원외처방 약제비 지원(장안구) (`gov24-374000000556`) → 33번 수원시 난임부부 원외처방 약제비 지원(권선구)
- 36. 수원시 난임부부 원외처방 약제비 지원(팔달구) (`gov24-374000000557`) → 33번 수원시 난임부부 원외처방 약제비 지원(권선구)
- 37. 수원시 자녀 출산·입양 지원금 (`bokjiro-wlf00001377`) → 38번 수원시 출생·입양 지원금 지급
- 40. 장애인가정 출산지원금 지급 (`bokjiro-wlf00001378`) → 39번 장애인가정 출산 지원
- 43. (수원시 영통구) 유축기 대여 지원 서비스 (`gov24-374000000568`) → 41번 (수원시 권선구) 유축기 대여 지원 서비스
- 44. (수원시 장안구) 유축기 대여 지원 서비스 (`gov24-374000000565`) → 41번 (수원시 권선구) 유축기 대여 지원 서비스
- 45. (수원시 팔달구) 유축기 대여 지원 서비스 (`gov24-374000000567`) → 41번 (수원시 권선구) 유축기 대여 지원 서비스
- 48. 예비 신혼 부부를 위한 건강검진 (`bokjiro-wlf00001376`) → 24번 (수원시 권선구) 임산부 및 예비·신혼부부 검사 지원
- 55. 장애인가정 출산지원금지원 (`bokjiro-wlf00001274`) → 54번 장애인가정 출산지원금 지급
- 56. 출산장려금 지원 (`bokjiro-wlf00001360`) → 50번 성남시 출산장려 지원
- 58. 다자녀사랑 안심보험 (`bokjiro-wlf00006151`) → 50번 성남시 출산장려 지원
- 59. 다자녀아동양육수당 (`bokjiro-wlf00001568`) → 50번 성남시 출산장려 지원
- 63. 성남시 아동의료비 본인부담 100만원 상한제 사업 (`bokjiro-wlf00001629`) → 65번 아동 의료비 지원
- 80. 임신축하금 지원/출산지원금 지원(만안구) (`gov24-383000000127`) → 79번 임신축하금 지원/출산지원금 지원(동안구)
- 83. 장애인가정 출산장려금 지원 (`bokjiro-wlf00002478`) → 84번 장애인가정 출산지원금 지원
- 86. 출산준비교육(동안구) (`gov24-383000000157`) → 85번 출산준비교육
- 100. 유축기 대여 서비스(동안구) (`gov24-383000000156`) → 99번 유축기 대여 서비스 제공(만안구)
- 102. 출산지원금 지급 (`bokjiro-wlf00004313`) → 103번 출산지원금 지원
- 110. 기형아 검사 쿠폰 지원사업 (`bokjiro-wlf00001449`) → 113번 임산부 산전 및 기형아 검사비 지원
- 111. 산전 검사 쿠폰 지원사업 (`bokjiro-wlf00001469`) → 113번 임산부 산전 및 기형아 검사비 지원
- 115. 출산축하금지원 사업 (`bokjiro-wlf00001541`) → 114번 출산축하금 지급
- 125. 산모신생아 건강관리 서비스 (`gov24-391000000120`) → 6번 산모 신생아 건강관리 지원사업(추가형)
- 129. 평택시 난임부부 약제비 지원(송탄보건소) (`gov24-391000000549`) → 130번 평택시 난임부부 약제비 지원(평택보건소)
- 152. 출생축하용품 지원 (`bokjiro-wlf00002807`) → 151번 출생축하금 지원
- 154. 안산 행복플러스카드 (`bokjiro-wlf00002707`) → 147번 안산시 임산부 행복플러스카드
- 163. 출산지원금 (`bokjiro-wlf00002522`) → 162번 출산·양육 지원
- 175. 장애인가정 출산지원금 (`bokjiro-wlf00001484`) → 174번 장애인가정 출산 지원
- 176. 출산·입양장려금 지원 (`bokjiro-wlf00001514`) → 168번 과천시 출산장려금 지원
- 177. 태아기형아검사 지원사업 (`bokjiro-wlf00001515`) → 180번 기형아선별검사 쿠폰 지원
- 191. 첫째아이부터 신생아 출산지원금 확대 지원 (`bokjiro-wlf00003556`) → 188번 신생아 출산지원금 지원
- 194. 다자녀가구 행복더하기(지역화폐) (`bokjiro-wlf00003868`) → 193번 다자녀가구 지원
- 195. 어린이집 이용 아동(다자녀 아동 등) 입소료 지원 (`bokjiro-wlf00003554`) → 196번 어린이집 이용아동 입소료 지원
- 210. 보완적 출산장려지원 (첫째아이 이상 출산지원금 지급) (`bokjiro-wlf00004253`) → 209번 보완적 출산장려 지원
- 211. 보완적 출산장려지원 (출산축하용품) (`bokjiro-wlf00003657`) → 209번 보완적 출산장려 지원
- 215. 어린이집 입학준비금 지원 (`bokjiro-wlf00003680`) → 216번 어린이집 입학준비금(현장학습비 등) 지원
- 233. 임신축하금 지급 (`bokjiro-wlf00001473`) → 236번 모자건강지원
- 240. 산모건강관리사 지원 (`bokjiro-wlf00005091`) → 242번 의왕시 산모건강관리사 본인부담금 환급 지원
- 270. 용인시 난임부부 시술비 본인부담금 추가지원 사업 (`bokjiro-wlf00005467`) → 276번 용인시 난임부부 시술비 추가 지원(처인구)
- 271. 용인시 난임부부 시술비 약제비 지원 (기흥구) (`gov24-405000000687`) → 273번 용인시 난임부부 시술비 약제비 지원(처인구)
- 272. 용인시 난임부부 시술비 약제비 지원(수지구) (`gov24-405000000686`) → 273번 용인시 난임부부 시술비 약제비 지원(처인구)
- 274. 용인시 난임부부 시술비 추가 지원 (기흥구) (`gov24-405000000679`) → 276번 용인시 난임부부 시술비 추가 지원(처인구)
- 275. 용인시 난임부부 시술비 추가 지원(수지구) (`gov24-405000000680`) → 276번 용인시 난임부부 시술비 추가 지원(처인구)
- 280. 유축기 대여 서비스(기흥구) (`gov24-405000000670`) → 282번 유축기 대여 서비스(처인구)
- 281. 유축기 대여 서비스(수지구) (`gov24-405000000669`) → 282번 유축기 대여 서비스(처인구)
- 284. 취약계층 아동 입학준비금 지원 (`bokjiro-wlf00001402`) → 285번 취약계층 입학준비금 지원
- 291. 출생축하 지원 (`bokjiro-wlf00001658`) → 292번 출생축하금 지원
- 319. 임신축하금 지급 (`bokjiro-wlf00004512`) → 320번 임신축하금 지원
- 321. 출산축하금 지원 (`bokjiro-wlf00003973`) → 322번 출산축하금 지원 (둘째자녀부터 적용)
- 328. (화성시 만세구) 난임부부 시술비 약제비 지원 (`gov24-553000000590`) → 327번 (화성시 동탄구)난임부부 시술 약제비 지원
- 329. (화성시 병점구) 난임부부 시술 약제비 지원 (`gov24-553000000589`) → 327번 (화성시 동탄구)난임부부 시술 약제비 지원
- 330. (화성시효행구)난임부부 시술 약제비 지원 신청 (`gov24-553000000591`) → 327번 (화성시 동탄구)난임부부 시술 약제비 지원
- 337. 다태임신 임산부 교통비 지원 (`bokjiro-wlf00006471`) → 338번 다태임신 임산부 교통비 지원(광주시)
- 341. 산모·신생아 건강관리 지원사업 본인부담금 지원 (`bokjiro-wlf00005227`) → 339번 산모·신생아 건강관리 서비스 본인부담금 지원(경기도 광주시)
- 342. 선천성 장애아 발견을 위한 기형아 검사비 지원 (`bokjiro-wlf00006786`) → 352번 기형아 검사비 지원(경기도 광주시)
- 353. 법정저소득층 입학준비금 (`bokjiro-wlf00000285`) → 354번 법정저소득층아동 어린이집 입학준비금 지원
- 402. 자녀출산·입양축하금 지원 (`bokjiro-wlf00002609`) → 403번 출산축하금 지원
