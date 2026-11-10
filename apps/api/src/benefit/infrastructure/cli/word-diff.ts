import { type Change, diffWords } from 'diff';

// 바뀐 말 앞뒤로 남길 글자 수. 무엇이 바뀌었는지 알아볼 만큼만 남겨 읽는 양을 줄인다
const CONTEXT = 40;
// 한 번에 더하거나 지운 말이 이보다 길면 자른다 (필드가 통째로 생기거나 사라진 경우)
const MAX_CHANGE = 200;
const GAP = '…';

// 원문 필드의 이전 값과 지금 값을 단어 단위로 비교해 바뀐 곳만 보여준다: "최대 [-30-]{+50+}만원 지원".
// 띄어쓰기·줄바꿈 차이는 보지 않으므로, 그것만 바뀌었으면 null
export function wordDiffExcerpt(before: unknown, after: unknown): string | null {
  const [a, b] = [toText(before), toText(after)];
  if (a === b) return null;

  const parts = diffWords(a, b);
  return parts.map((part, index) => toPiece(part, index, parts.length)).join('');
}

function toPiece(part: Change, index: number, count: number): string {
  if (part.added) return `{+${truncated(part.value)}+}`;
  if (part.removed) return `[-${truncated(part.value)}-]`;
  return collapsed(part.value, index === 0, index === count - 1);
}

// 바뀌지 않은 부분은 바뀐 말과 맞닿은 쪽만 남긴다
function collapsed(text: string, isFirst: boolean, isLast: boolean): string {
  if (isFirst && isLast) return text;
  if (isFirst) return text.length > CONTEXT ? `${GAP}${text.slice(-CONTEXT)}` : text;
  if (isLast) return text.length > CONTEXT ? `${text.slice(0, CONTEXT)}${GAP}` : text;
  return text.length > CONTEXT * 2 ? `${text.slice(0, CONTEXT)} ${GAP} ${text.slice(-CONTEXT)}` : text;
}

function truncated(text: string): string {
  return text.length > MAX_CHANGE ? `${text.slice(0, MAX_CHANGE)}${GAP}(${text.length}자)` : text;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return (typeof value === 'string' ? value : JSON.stringify(value)).replace(/\s+/g, ' ').trim();
}
