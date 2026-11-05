import type { ChildStage } from './pregnancy';

export interface BabySize {
  emoji: string;
  fruit: string;
}

// 주수별로 아기 크기를 과일·채소에 견준 것. 재미로 보여주는 대략의 크기라 정확한 수치는 붙이지 않는다
const SIZES: { fromWeek: number; emoji: string; fruit: string }[] = [
  { fromWeek: 0, emoji: '🌱', fruit: '작은 씨앗' },
  { fromWeek: 5, emoji: '🫘', fruit: '콩알' },
  { fromWeek: 7, emoji: '🫐', fruit: '블루베리' },
  { fromWeek: 8, emoji: '🍒', fruit: '체리' },
  { fromWeek: 10, emoji: '🍓', fruit: '딸기' },
  { fromWeek: 12, emoji: '🍋', fruit: '레몬' },
  { fromWeek: 14, emoji: '🍑', fruit: '복숭아' },
  { fromWeek: 16, emoji: '🍎', fruit: '사과' },
  { fromWeek: 18, emoji: '🍐', fruit: '배' },
  { fromWeek: 20, emoji: '🍌', fruit: '바나나' },
  { fromWeek: 22, emoji: '🌽', fruit: '옥수수' },
  { fromWeek: 24, emoji: '🍆', fruit: '가지' },
  { fromWeek: 26, emoji: '🥦', fruit: '브로콜리' },
  { fromWeek: 28, emoji: '🥥', fruit: '코코넛' },
  { fromWeek: 31, emoji: '🍍', fruit: '파인애플' },
  { fromWeek: 34, emoji: '🍈', fruit: '멜론' },
  { fromWeek: 37, emoji: '🍉', fruit: '수박' },
];

// 임신 중일 때만 크기가 있다. 출산예정일이 지나면 마지막 크기(수박)로 본다
export function babySizeOf(stage: ChildStage): BabySize | null {
  if (stage.kind === 'after-due') return SIZES[SIZES.length - 1];
  if (stage.kind !== 'pregnant') return null;
  return SIZES.findLast((size) => stage.weeks >= size.fromWeek)!;
}
