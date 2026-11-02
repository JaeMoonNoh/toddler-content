// 한국 시각 "2026-11-03 04:00"
export function formatKst(at: Date): string {
  return at.toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 16);
}

export function formatKstDate(at: Date): string {
  return formatKst(at).slice(0, 10);
}
