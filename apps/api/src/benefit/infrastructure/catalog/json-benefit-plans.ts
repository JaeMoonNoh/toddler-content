import { CatalogError } from '../../application/benefit-catalog.service';
import { BenefitPlan } from '../../domain/benefit-plan';

import { amountOf, periodOf, scheduleOf } from './json-benefit-catalog';

const PLAN_FIELDS = ['schedule', 'amount', 'applicationPeriod'] as const;

// 일정·금액 초안 파일 (JSON 배열). 정리하지 않은 필드를 빠뜨린 것과 원문에 없어서 비운 것을 구분하려고 null이라도 적게 한다
export function parsePlans(text: string): BenefitPlan[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new CatalogError(`초안이 올바른 JSON이 아닙니다: ${(error as Error).message}`);
  }
  if (!Array.isArray(raw)) throw new CatalogError('초안은 배열이어야 합니다');
  return raw.map((entry, index) => toPlan(entry, index));
}

function toPlan(entry: unknown, index: number): BenefitPlan {
  const e = (entry ?? {}) as Record<string, unknown>;
  const where = `초안 ${index + 1}번째(${typeof e.slug === 'string' ? e.slug : ''})`;
  if (typeof e.slug !== 'string') throw new CatalogError(`${where}: slug가 문자열이 아닙니다`);
  const missing = PLAN_FIELDS.filter((field) => e[field] === undefined);
  if (missing.length) throw new CatalogError(`${where}: ${missing.join(', ')}가 없습니다 (정할 수 없으면 null로 적어 주세요)`);
  return new BenefitPlan(
    e.slug,
    e.schedule === null ? null : scheduleOf(e.schedule, where),
    e.amount === null ? null : amountOf(e.amount, where),
    e.applicationPeriod === null ? null : periodOf(e.applicationPeriod, where),
    typeof e.note === 'string' ? e.note : '',
  );
}
