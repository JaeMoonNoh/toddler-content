import type { SourceId } from './source-id';

export type Payload = Record<string, unknown>;

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

interface ComparisonSpec {
  volatile: readonly string[];
  unorderedLists?: readonly string[];
}

const LIST_SEPARATOR = ', ';

// 출처가 준 원본 두 개를 "같다"고 볼지 정하는 규칙. 수집의 변경 감지와 혜택의 검토 상태가 함께 쓴다.
// 원본은 받은 그대로 저장하고, 비교하는 순간에만 같은 모양으로 맞춘다
export class ComparisonRule {
  constructor(private readonly spec: ComparisonSpec) {}

  static of(source: SourceId): ComparisonRule {
    return RULES[source];
  }

  isSame(before: Payload, after: Payload): boolean {
    return stableStringify(this.toComparable(before)) === stableStringify(this.toComparable(after));
  }

  changedFields(before: Payload, after: Payload): FieldChange[] {
    const fields = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const field of this.spec.volatile) fields.delete(field);
    return [...fields]
      .sort()
      .filter((field) => !this.isSameValue(field, before[field], after[field]))
      .map((field) => ({ field, before: before[field] ?? null, after: after[field] ?? null }));
  }

  private isSameValue(field: string, before: unknown, after: unknown): boolean {
    return stableStringify(this.toComparableValue(field, before)) === stableStringify(this.toComparableValue(field, after));
  }

  private toComparable(payload: Payload): Payload {
    const copy: Payload = {};
    for (const [field, value] of Object.entries(payload)) {
      if (!this.spec.volatile.includes(field)) copy[field] = this.toComparableValue(field, value);
    }
    return copy;
  }

  private toComparableValue(field: string, value: unknown): unknown {
    const isUnorderedList = this.spec.unorderedLists?.includes(field) && typeof value === 'string';
    return isUnorderedList ? value.split(LIST_SEPARATOR).sort().join(LIST_SEPARATOR) : value;
  }
}

// 키 순서와 상관없이 같은 내용이면 같은 문자열이 나오도록 정렬해서 직렬화
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value ?? null);
}

// NOTE: volatile은 매일 바뀌어서 변경으로 보면 안 되는 필드(조회수)다. 빼지 않으면 매일 수천 건이 "변경"으로 잡힌다
// NOTE: unorderedLists는 ", "로 이어 붙인 순서 없는 목록이다. 2026-11-03 수집의 변경 272건이 모두 이 세 필드의 순서 차이였다.
// 순서가 바뀐 증거가 없는 필드는 넣지 않는다
const RULES: Record<SourceId, ComparisonRule> = {
  GOV24: new ComparisonRule({ volatile: ['조회수'] }),
  BOKJIRO_NATIONAL: new ComparisonRule({ volatile: ['inqNum'] }),
  BOKJIRO_LOCAL: new ComparisonRule({
    volatile: ['inqNum'],
    unorderedLists: ['lifeNmArray', 'intrsThemaNmArray', 'trgterIndvdlNmArray'],
  }),
};
