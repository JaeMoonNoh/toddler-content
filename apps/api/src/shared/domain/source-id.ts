// 혜택 데이터를 주는 공공 API 출처. 수집(collect)과 혜택(benefit)이 함께 쓴다
export type SourceId = 'GOV24' | 'BOKJIRO_NATIONAL' | 'BOKJIRO_LOCAL';

// 목록에 본문(지원대상·선정기준·지원내용)이 없어 상세를 따로 받는 출처. 보조금24는 목록에 본문이 다 있다
export type DetailSourceId = Extract<SourceId, 'BOKJIRO_NATIONAL' | 'BOKJIRO_LOCAL'>;
