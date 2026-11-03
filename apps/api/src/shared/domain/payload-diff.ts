import { createHash } from 'node:crypto';

// 원본 내용(payload)을 비교하는 규칙. 수집의 변경 감지와 혜택의 검토 상태가 함께 쓴다

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
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

function withoutIgnored(payload: Record<string, unknown>, ignored: readonly string[]) {
  const copy = { ...payload };
  for (const field of ignored) delete copy[field];
  return copy;
}

export function hashPayload(payload: Record<string, unknown>, ignored: readonly string[] = []): string {
  return createHash('sha256')
    .update(stableStringify(withoutIgnored(payload, ignored)))
    .digest('hex');
}

export function changedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  ignored: readonly string[] = [],
): FieldChange[] {
  const fields = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const field of ignored) fields.delete(field);
  return [...fields]
    .sort()
    .filter((field) => stableStringify(before[field]) !== stableStringify(after[field]))
    .map((field) => ({ field, before: before[field] ?? null, after: after[field] ?? null }));
}
