import { CatalogError } from '../../application/benefit-catalog.service';

import type { CandidateDecision } from '../../application/benefit-candidate.service';
import type { Audience } from '../../domain/audience';
import type { EligibilityCondition } from '../../domain/eligibility-condition';

// 후보 판단 파일 (JSON 배열). 값이 맞는지는 도메인이 검사하고, 여기서는 모양만 본다
export function parseDecisions(text: string): CandidateDecision[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new CatalogError(`판단 파일이 올바른 JSON이 아닙니다: ${(error as Error).message}`);
  }
  if (!Array.isArray(raw)) throw new CatalogError('판단 파일은 배열이어야 합니다');
  return raw.map((entry, index) => toDecision(entry, index));
}

function toDecision(entry: unknown, index: number): CandidateDecision {
  const e = (entry ?? {}) as Record<string, unknown>;
  const where = `판단 ${index + 1}번째(${typeof e.slug === 'string' ? e.slug : ''})`;
  const strings = (value: unknown, field: string) => {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.some((v) => typeof v !== 'string'))
      throw new CatalogError(`${where}: ${field}는 문자열 배열이어야 합니다`);
    return value as string[];
  };
  const text = (value: unknown, field: string) => {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') throw new CatalogError(`${where}: ${field}가 문자열이 아닙니다`);
    return value;
  };
  if (typeof e.slug !== 'string') throw new CatalogError(`${where}: slug가 문자열이 아닙니다`);
  return {
    slug: e.slug,
    merge: strings(e.merge, 'merge'),
    name: text(e.name, 'name'),
    audience: text(e.audience, 'audience') as Audience | undefined,
    conditions: strings(e.conditions, 'conditions') as EligibilityCondition[] | undefined,
  };
}
