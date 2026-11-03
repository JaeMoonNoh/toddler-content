// 혜택 데이터를 주는 공공 API 출처. 수집(collect)과 혜택(benefit)이 함께 쓴다
export type SourceId = 'GOV24' | 'BOKJIRO_NATIONAL' | 'BOKJIRO_LOCAL';

// NOTE: 매일 바뀌어서 변경으로 보면 안 되는 필드 (조회수). 빼지 않으면 매일 수천 건이 "변경"으로 잡힌다
export const VOLATILE_FIELDS: Record<SourceId, readonly string[]> = {
  GOV24: ['조회수'],
  BOKJIRO_NATIONAL: ['inqNum'],
  BOKJIRO_LOCAL: ['inqNum'],
};
