export const NAME_MAX_LENGTH = 10;
const DEFAULT_NAME = '우리 아이';

// 태어나기 전에는 태명, 태어난 뒤에는 이름(없으면 태명)으로 부른다. 둘 다 없으면 "우리 아이"
export function callNameOf({ nickname, name, born }: { nickname: string; name: string; born: boolean }): string {
  return (born && name.trim()) || nickname.trim() || DEFAULT_NAME;
}

// 마지막 글자에 받침이 있으면 "은", 없으면 "는". 한글로 끝나지 않으면 둘 다 적는다
export function withTopicParticle(word: string): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${word}은(는)`;
  return code % 28 === 0 ? `${word}는` : `${word}은`;
}
