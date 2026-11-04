import { readFile, writeFile } from 'node:fs/promises';

import { CatalogError } from '../../application/benefit-catalog.service';
import { BenefitCatalog } from '../../application/ports/benefit-catalog';
import { SourceRef } from '../../domain/source-ref';

import type { SourceId } from '../../../shared/domain/source-id';
import type { ApplicationPeriod } from '../../domain/application-period';
import type { Audience } from '../../domain/audience';
import type { BenefitDetails } from '../../domain/benefit';
import type { AmountKind, AmountTier, BenefitAmount } from '../../domain/benefit-amount';
import type { BenefitSchedule, ScheduleAnchor, ScheduleOffset } from '../../domain/benefit-schedule';
import type { EligibilityCondition } from '../../domain/eligibility-condition';
import type { HowToApply } from '../../domain/how-to-apply';

const SOURCE_IDS: readonly string[] = ['GOV24', 'BOKJIRO_NATIONAL', 'BOKJIRO_LOCAL'] satisfies SourceId[];

// apps/api/data/benefit-catalog.json. 값이 맞는지는 도메인이 검사하고, 여기서는 모양만 본다
export class JsonBenefitCatalog extends BenefitCatalog {
  constructor(private readonly path: string) {
    super();
  }

  async load(): Promise<BenefitDetails[]> {
    return parseCatalog(await readFile(this.path, 'utf8'));
  }

  // 사람이 PR에서 보는 파일이라 바꾼 혜택만 다시 쓰고 나머지는 글자 하나 바꾸지 않는다
  async update(entries: BenefitDetails[]): Promise<void> {
    const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
    const raw = JSON.parse(await readFile(this.path, 'utf8')) as { slug: string }[];
    const updated = raw.map((entry) => {
      const details = bySlug.get(entry.slug);
      return details ? toJsonEntry(details) : entry;
    });
    await writeFile(this.path, JSON.stringify(updated, null, 2) + '\n');
  }
}

export function parseCatalog(text: string): BenefitDetails[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new CatalogError(`혜택 목록이 올바른 JSON이 아닙니다: ${(error as Error).message}`);
  }
  if (!Array.isArray(raw)) throw new CatalogError('혜택 목록은 배열이어야 합니다');
  return raw.map((entry, index) => toDetails(entry, index));
}

// 값이 없는 필드는 빼서 목록 파일을 짧게 둔다
export function toJsonEntry(details: BenefitDetails): Record<string, unknown> {
  const { slug, name, regionCode, sourceUrl, sources, conditions, audience, howToApply, schedule, amount, applicationPeriod } = details;
  return {
    slug,
    name,
    regionCode,
    sourceUrl,
    sources: sources.map(({ source, externalId }) => ({ source, externalId })),
    ...(conditions.length > 0 && { conditions }),
    ...(audience && { audience }),
    ...(howToApply && { howToApply }),
    ...(schedule && { schedule }),
    ...(amount && { amount }),
    ...(applicationPeriod && { applicationPeriod }),
  };
}

function toDetails(entry: unknown, index: number): BenefitDetails {
  const e = (entry ?? {}) as Record<string, unknown>;
  const where = `${index + 1}번째 항목(${typeof e.slug === 'string' ? e.slug : ''})`;
  const text = (field: string) => {
    if (typeof e[field] !== 'string') throw new CatalogError(`${where}: ${field}가 문자열이 아닙니다`);
    return e[field];
  };
  return {
    slug: text('slug'),
    name: text('name'),
    regionCode: text('regionCode'),
    sourceUrl: text('sourceUrl'),
    sources: sourcesOf(e.sources, where),
    schedule: e.schedule === undefined || e.schedule === null ? null : scheduleOf(e.schedule, where),
    conditions: conditionsOf(e.conditions, where),
    amount: e.amount === undefined || e.amount === null ? null : amountOf(e.amount, where),
    applicationPeriod: e.applicationPeriod === undefined || e.applicationPeriod === null ? null : periodOf(e.applicationPeriod, where),
    howToApply: e.howToApply === undefined || e.howToApply === null ? null : howToApplyOf(e.howToApply, where),
    audience: audienceOf(e.audience, where),
  };
}

function sourcesOf(value: unknown, where: string): SourceRef[] {
  if (!Array.isArray(value)) throw new CatalogError(`${where}: sources가 배열이 아닙니다`);
  return value.map((s: Record<string, unknown> | null) => {
    if (!SOURCE_IDS.includes(String(s?.source)) || typeof s?.externalId !== 'string' || !s.externalId) {
      throw new CatalogError(`${where}: 알 수 없는 원본입니다 (${JSON.stringify(s)})`);
    }
    return new SourceRef(s.source as SourceId, s.externalId);
  });
}

const ANCHORS: readonly string[] = ['pregnancy', 'birth'] satisfies ScheduleAnchor[];

export function scheduleOf(value: unknown, where: string): BenefitSchedule {
  const s = (value ?? {}) as Record<string, unknown>;
  const basis = (s.basis ?? {}) as Record<string, unknown>;
  const text = (v: unknown, field: string) => {
    if (typeof v !== 'string') throw new CatalogError(`${where}: schedule.${field}가 문자열이 아닙니다`);
    return v;
  };
  return {
    from: offsetOf(s.from, `${where}: schedule.from`),
    until: offsetOf(s.until, `${where}: schedule.until`),
    untilLabel: text(s.untilLabel, 'untilLabel'),
    summary: text(s.summary, 'summary'),
    basis: { text: text(basis.text, 'basis.text'), url: text(basis.url, 'basis.url') },
  };
}

function offsetOf(value: unknown, where: string): ScheduleOffset {
  const o = (value ?? {}) as Record<string, unknown>;
  const whole = (v: unknown) => (v === undefined ? 0 : v);
  const months = whole(o.months);
  const days = whole(o.days);
  if (!ANCHORS.includes(String(o.anchor))) throw new CatalogError(`${where}: anchor는 pregnancy 또는 birth여야 합니다`);
  if (!Number.isInteger(months) || !Number.isInteger(days)) throw new CatalogError(`${where}: months, days는 정수여야 합니다`);
  return { anchor: o.anchor as ScheduleAnchor, months: months as number, days: days as number };
}

// 어떤 조건이 있는지는 도메인이 검사한다
function conditionsOf(value: unknown, where: string): EligibilityCondition[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((c) => typeof c !== 'string'))
    throw new CatalogError(`${where}: conditions는 문자열 배열이어야 합니다`);
  return value as EligibilityCondition[];
}

// 값이 맞는지는 도메인이 검사하고, 여기서는 모양만 본다
export function amountOf(value: unknown, where: string): BenefitAmount {
  const a = (value ?? {}) as Record<string, unknown>;
  const basis = (a.basis ?? {}) as Record<string, unknown>;
  const text = (v: unknown, field: string) => {
    if (typeof v !== 'string') throw new CatalogError(`${where}: amount.${field}가 문자열이 아닙니다`);
    return v;
  };
  if (a.tiers !== null && !Array.isArray(a.tiers)) throw new CatalogError(`${where}: amount.tiers는 배열 또는 null이어야 합니다`);
  return {
    kind: text(a.kind, 'kind') as AmountKind,
    summary: text(a.summary, 'summary'),
    tiers: a.tiers === null ? null : (a.tiers as unknown[]).map((t) => tierOf(t, where)),
    basis: { text: text(basis.text, 'basis.text'), url: text(basis.url, 'basis.url') },
  };
}

function tierOf(value: unknown, where: string): AmountTier {
  const t = (value ?? {}) as Record<string, unknown>;
  const max = t.maxBirthOrder === undefined ? null : t.maxBirthOrder;
  if (typeof t.minBirthOrder !== 'number' || typeof t.won !== 'number' || (max !== null && typeof max !== 'number')) {
    throw new CatalogError(`${where}: amount.tiers의 minBirthOrder, maxBirthOrder, won은 숫자여야 합니다`);
  }
  return { minBirthOrder: t.minBirthOrder, maxBirthOrder: max, won: t.won };
}

function howToApplyOf(value: unknown, where: string): HowToApply {
  const h = (value ?? {}) as Record<string, unknown>;
  const basis = (h.basis ?? {}) as Record<string, unknown>;
  const text = (v: unknown, field: string) => {
    if (typeof v !== 'string') throw new CatalogError(`${where}: howToApply.${field}가 문자열이 아닙니다`);
    return v;
  };
  return { summary: text(h.summary, 'summary'), basis: { text: text(basis.text, 'basis.text'), url: text(basis.url, 'basis.url') } };
}

export function periodOf(value: unknown, where: string): ApplicationPeriod {
  const p = (value ?? {}) as Record<string, unknown>;
  const basis = (p.basis ?? {}) as Record<string, unknown>;
  const text = (v: unknown, field: string) => {
    if (typeof v !== 'string') throw new CatalogError(`${where}: applicationPeriod.${field}가 문자열이 아닙니다`);
    return v;
  };
  return {
    start: text(p.start, 'start'),
    end: text(p.end, 'end'),
    basis: { text: text(basis.text, 'basis.text'), url: text(basis.url, 'basis.url') },
  };
}

function audienceOf(value: unknown, where: string): Audience | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new CatalogError(`${where}: audience가 문자열이 아닙니다`);
  return value as Audience;
}
