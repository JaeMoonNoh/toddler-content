import { readFile } from 'node:fs/promises';
import type { SourceId } from '../../../collect/domain/source-record';
import { CatalogError } from '../../application/sync-catalog.use-case';
import { BenefitCatalog } from '../../application/ports/benefit-catalog';
import type { BenefitDetails, BenefitScope } from '../../domain/benefit';
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
