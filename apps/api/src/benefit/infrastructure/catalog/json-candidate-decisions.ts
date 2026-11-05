import { CatalogError } from '../../application/benefit-catalog.service';

import type { CandidateDecision } from '../../application/benefit-candidate.service';
import type { Audience } from '../../domain/audience';
import type { CandidateJudgment } from '../../domain/candidate-judgment';
import type { EligibilityCondition } from '../../domain/eligibility-condition';

const DECISIONS = ['include', 'merge', 'exclude'];

// 후보 판단 파일 (JSON 배열). 값이 맞는지는 도메인이 검사하고, 여기서는 모양만 본다.
// 고르기 규칙의 판단 파일(decision: include·merge·exclude)과, 넣을 카드만 적은 짧은 모양을 둘 다 읽는다
export function parseDecisions(text: string): CandidateDecision[] {
  const raw = parseArray(text);
  if (raw.some((entry) => isRecord(entry) && 'decision' in entry)) return decisionsFrom(parseJudgments(text));
  return raw.map((entry, index) => toDecision(entry, index));
}

// docs/benefit-candidate-rules.md의 판단 파일
export function parseJudgments(text: string): CandidateJudgment[] {
  return parseArray(text).map((entry, index) => {
    const e = isRecord(entry) ? entry : {};
    const where = `판단 ${index + 1}번째(${typeof e.slug === 'string' ? e.slug : ''})`;
    if (typeof e.slug !== 'string') throw new CatalogError(`${where}: slug가 문자열이 아닙니다`);
    if (!DECISIONS.includes(e.decision as string)) throw new CatalogError(`${where}: decision은 ${DECISIONS.join('|')} 중 하나여야 합니다`);
    if (e.decision === 'merge' && typeof e.into !== 'string')
      throw new CatalogError(`${where}: merge에는 into(합칠 대표 slug)가 필요합니다`);
    const decision = toDecision(e, index);
    return {
      ...decision,
      decision: e.decision as CandidateJudgment['decision'],
      into: e.into as string | undefined,
      rule: e.rule as number | undefined,
      reason: e.reason as string | undefined,
      note: e.note as string | undefined,
    };
  });
}

// 넣는 후보마다, 그 후보로 합치기로 한 후보들을 두 번째 원본으로 붙인다
function decisionsFrom(judgments: CandidateJudgment[]): CandidateDecision[] {
  const included = judgments.filter((judgment) => judgment.decision === 'include');
  const includedSlugs = new Set(included.map((judgment) => judgment.slug));
  for (const merged of judgments.filter((judgment) => judgment.decision === 'merge')) {
    if (!includedSlugs.has(merged.into!))
      throw new CatalogError(`${merged.slug}: 합칠 대상 ${merged.into}은(는) 넣기로 한 후보가 아닙니다`);
  }
  return included.map(({ slug, name, audience, conditions }) => {
    const merge = judgments.filter((judgment) => judgment.decision === 'merge' && judgment.into === slug).map((judgment) => judgment.slug);
    return { slug, merge: merge.length ? merge : undefined, name, audience, conditions };
  });
}

function parseArray(text: string): unknown[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new CatalogError(`판단 파일이 올바른 JSON이 아닙니다: ${(error as Error).message}`);
  }
  if (!Array.isArray(raw)) throw new CatalogError('판단 파일은 배열이어야 합니다');
  return raw;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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
