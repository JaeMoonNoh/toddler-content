// 수집 결과를 받아들일지 정하는 비즈니스 정책

// 이전보다 이 비율 미만으로 줄면 API 장애로 보고 중단한다
export const MIN_KEEP_RATIO = 0.9;

export class CollectionRejectedError extends Error {}

export function assertAcceptable(previousActive: number, currentCount: number, minRatio = MIN_KEEP_RATIO) {
  if (currentCount === 0) {
    throw new CollectionRejectedError('받은 항목이 0건이라 수집을 중단했습니다. API 응답을 확인하세요.');
  }
  if (previousActive > 0 && currentCount < previousActive * minRatio) {
    throw new CollectionRejectedError(
      `받은 항목 수(${currentCount})가 이전(${previousActive})의 ${Math.round(minRatio * 100)}% 미만이라 수집을 중단했습니다. API 응답을 확인하세요.`,
    );
  }
}

// 이 출처를 처음 수집하면 변경 내역 없이 기준점만 저장한다
export function isBaseline(knownItemCount: number) {
  return knownItemCount === 0;
}
