export type SavedState = 'applied' | 'todo';

// 챙기려고 저장한 혜택 하나와 신청을 마쳤는지
export interface SavedBenefit {
  slug: string;
  state: SavedState;
}

export class InvalidSavedBenefitError extends Error {}

export const MAX_SAVED_BENEFITS = 500;
const SLUG = /^[a-z0-9-]{1,100}$/;
const STATES: SavedState[] = ['todo', 'applied'];

export function toSavedBenefit(slug: unknown, state: unknown): SavedBenefit {
  if (typeof slug !== 'string' || !SLUG.test(slug)) throw new InvalidSavedBenefitError('혜택 slug 형식이 올바르지 않습니다');
  if (!STATES.includes(state as SavedState)) throw new InvalidSavedBenefitError(`state는 ${STATES.join('|')} 중 하나여야 합니다`);
  return { slug, state: state as SavedState };
}

// 이 기기에 저장해 둔 것과 계정에 있던 것을 합친다. 같은 혜택이면 신청을 마친 쪽을 남긴다 (진행 상태가 뒤로 가지 않게)
export function mergeSavedBenefits(account: SavedBenefit[], device: SavedBenefit[]): SavedBenefit[] {
  const merged = new Map(account.map((item) => [item.slug, item.state]));
  for (const { slug, state } of device) {
    if (merged.get(slug) !== 'applied') merged.set(slug, state);
  }
  return [...merged].map(([slug, state]) => ({ slug, state }));
}
