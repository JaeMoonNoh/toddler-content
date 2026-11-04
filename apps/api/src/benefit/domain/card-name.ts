// 원문 서비스명에서 지역 머리말·꼬리말을 뗀다. 카드에는 지역이 따로 보여서 이름에 또 쓰면 길어진다
// 예: "(경기도 수원시) 출산지원금" → "출산지원금", "[강남구] 산후조리비" → "산후조리비", "임신축하금(고양시)" → "임신축하금"

// NOTE: "○○도"로 끝나는 말을 모두 시·도로 보면 "수도요금"의 "수도"까지 뗀다. 실제 이름만 쓴다
const PROVINCE =
  '(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원특별자치도|강원도|' +
  '충청북도|충청남도|전북특별자치도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)';
const PLACE = `((${PROVINCE}|서울) )?[가-힣]+(시|군|구)( [가-힣]+(시|군|구))?`;
const LEADING = new RegExp(`^(\\(${PLACE}\\)|\\[${PLACE}\\]|${PLACE}\\]|\\(${PROVINCE}\\)|${PROVINCE} ?|서울시 ?)\\s*`);
const TRAILING = new RegExp(`\\s*\\(${PLACE}\\)\\s*$`);

export function toCardName(sourceName: string): string {
  return sourceName.replace(LEADING, '').replace(TRAILING, '').trim();
}
