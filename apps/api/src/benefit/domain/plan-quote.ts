// 초안의 근거(basis.text)가 원문을 그대로 옮긴 것인지 본다. 띄어쓰기와 가운뎃점은 원문마다 달라서 무시한다
const QUOTE_SEPARATOR = ' / ';
// "지원내용: …"처럼 앞에 붙인 짧은 이름표는 원문에 없어도 된다
const LABEL = /^[^:：]{1,8}[:：]\s*/;

export function missingQuotes(basisText: string, sourceText: string): string[] {
  const source = normalize(sourceText);
  return basisText
    .split(QUOTE_SEPARATOR)
    .filter((part) => !source.includes(normalize(part)) && !source.includes(normalize(part.replace(LABEL, ''))));
}

function normalize(text: string): string {
  return text.replace(/\s+/g, '').replace(/[·ㆍ]/g, '');
}
