import { formatWon } from '../domain/amount';
import type { GiftCard } from '../domain/gift-card';

// 인스타그램 피드 비율(4:5). 서버로 아무것도 보내지 않도록 브라우저 캔버스에서 그린다
const WIDTH = 1080;
const HEIGHT = 1350;
const PAD = 72;
const COLOR = { bg: '#fff1e4', card: '#ffffff', ink: '#3a2e29', muted: '#6b5b53', accent: '#a8482c', fruit: '#fff8e1', line: '#f0e2d6' };
const DISPLAY = 'Jua';
const BODY = '"Gowun Dodum"';
const SERVICE_NAME = 'Toddler Content';

export interface GiftCardArt {
  card: GiftCard;
  callName: string;
  emoji: string;
}

export async function drawGiftCard({ card, callName, emoji }: GiftCardArt): Promise<Blob> {
  // NOTE: 캔버스는 글꼴이 다 받아지기 전에 그리면 기본 글꼴로 그려진다
  await Promise.all([document.fonts.load(`72px ${DISPLAY}`), document.fonts.load(`32px ${BODY}`)]);
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = COLOR.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawFruit(ctx, emoji);
  drawTitle(ctx, callName);
  drawAmounts(ctx, card);
  drawFooter(ctx, card);
  return toBlob(canvas);
}

function drawFruit(ctx: CanvasRenderingContext2D, emoji: string) {
  const cx = WIDTH - PAD - 88;
  const cy = PAD + 88;
  ctx.fillStyle = COLOR.fruit;
  ctx.beginPath();
  ctx.arc(cx, cy, 88, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '96px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, cx, cy + 4);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawTitle(ctx: CanvasRenderingContext2D, callName: string) {
  ctx.fillStyle = COLOR.accent;
  ctx.font = `36px ${DISPLAY}`;
  ctx.fillText(SERVICE_NAME, PAD, PAD + 36);
  ctx.fillStyle = COLOR.ink;
  ctx.font = `80px ${DISPLAY}`;
  ctx.fillText(fit(ctx, `${callName}에게 도착할`, WIDTH - PAD * 2), PAD, PAD + 250);
  ctx.fillText('축하 선물이에요', PAD, PAD + 350);
  ctx.fillStyle = COLOR.muted;
  ctx.font = `34px ${BODY}`;
  ctx.fillText('태어나면 나라와 지역에서 정해 둔 금액으로 받아요', PAD, PAD + 420);
}

function drawAmounts(ctx: CanvasRenderingContext2D, card: GiftCard) {
  const top = PAD + 480;
  const rows = card.lines.length + (card.moreCount > 0 ? 1 : 0);
  const height = 240 + rows * 70;
  ctx.fillStyle = COLOR.card;
  ctx.beginPath();
  ctx.roundRect(PAD, top, WIDTH - PAD * 2, height, 48);
  ctx.fill();

  const left = PAD + 52;
  const right = WIDTH - PAD - 52;
  ctx.fillStyle = COLOR.ink;
  ctx.font = `120px ${DISPLAY}`;
  ctx.fillText(formatWon(card.total), left, top + 160);

  ctx.font = `38px ${BODY}`;
  const rowsOf = [...card.lines.map((line) => [line.name, formatWon(line.won)]), ...(card.moreCount > 0 ? [[`그 밖에 ${card.moreCount}건`, '']] : [])];
  rowsOf.forEach(([name, won], index) => {
    const y = top + 250 + index * 70;
    ctx.fillStyle = COLOR.ink;
    ctx.textAlign = 'left';
    ctx.fillText(fit(ctx, name, right - left - 220), left, y);
    ctx.fillStyle = COLOR.muted;
    ctx.textAlign = 'right';
    ctx.fillText(won, right, y);
  });
  ctx.textAlign = 'left';
}

function drawFooter(ctx: CanvasRenderingContext2D, card: GiftCard) {
  const bottom = HEIGHT - PAD;
  ctx.fillStyle = COLOR.muted;
  ctx.font = `26px ${BODY}`;
  ctx.fillText(fit(ctx, card.basis, WIDTH - PAD * 2), PAD, bottom - 42);
  ctx.fillText(fit(ctx, card.source, WIDTH - PAD * 2), PAD, bottom);
}

// 너무 길면 끝을 줄임표로 자른다
function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
  return `${cut}…`;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('이미지를 만들지 못했어요'))), 'image/png'));
}
