import { readFile } from 'node:fs/promises';
import type { SourceId } from '../../../collect/domain/source-record';
import { CatalogError } from '../../application/sync-catalog.use-case';
import { BenefitCatalog } from '../../application/ports/benefit-catalog';
import type { BenefitDetails, BenefitScope } from '../../domain/benefit';
import type { BenefitSchedule, ScheduleAnchor, ScheduleOffset } from '../../domain/benefit-schedule';
import { SourceRef } from '../../domain/source-ref';

const SOURCE_IDS: readonly string[] = ['GOV24', 'BOKJIRO_NATIONAL', 'BOKJIRO_LOCAL'] satisfies SourceId[];

// apps/api/data/benefit-catalog.json. 값이 맞는지는 도메인이 검사하고, 여기서는 모양만 본다
export class JsonBenefitCatalog extends BenefitCatalog {
  constructor(private readonly path: string) {
    super();
  }

  async load(): Promise<BenefitDetails[]> {
    return parseCatalog(await readFile(this.path, 'utf8'));
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

function toDetails(entry: unknown, index: number): BenefitDetails {
  const e = (entry ?? {}) as Record<string, unknown>;
  const where = `${index + 1}번째 항목(${String(e.slug ?? '')})`;
  const text = (field: string) => {
    if (typeof e[field] !== 'string') throw new CatalogError(`${where}: ${field}가 문자열이 아닙니다`);
    return e[field] as string;
  };
  return {
    slug: text('slug'),
    name: text('name'),
    scope: text('scope') as BenefitScope,
    sourceUrl: text('sourceUrl'),
    sources: sourcesOf(e.sources, where),
    schedule: e.schedule === undefined || e.schedule === null ? null : scheduleOf(e.schedule, where),
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

function scheduleOf(value: unknown, where: string): BenefitSchedule {
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
