import type { DeadlineEvent } from './deadline-event';

const CRLF = '\r\n';
const MAX_LINE_BYTES = 75; // RFC 5545: 한 줄은 75바이트까지, 넘으면 다음 줄을 공백으로 시작해 잇는다
const REMIND_BEFORE = '-P3D'; // 마감 3일 전 알림

// 아이폰, 갤럭시, 구글 캘린더 모두 여는 .ics 파일
export class IcsCalendar {
  constructor(
    private readonly events: DeadlineEvent[],
    private readonly createdAt: Date,
  ) {}

  toString(): string {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//toddler-content//benefit deadlines//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...this.events.flatMap((event) => this.eventLines(event)),
      'END:VCALENDAR',
    ];
    return lines.map(fold).join(CRLF) + CRLF;
  }

  private eventLines(event: DeadlineEvent): string[] {
    return [
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${utcStamp(this.createdAt)}`,
      `DTSTART;VALUE=DATE:${event.date.toCompact()}`,
      `DTEND;VALUE=DATE:${event.date.addDays(1).toCompact()}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      `URL:${event.url}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(event.title)}`,
      `TRIGGER:${REMIND_BEFORE}`,
      'END:VALARM',
      'END:VEVENT',
    ];
  }
}

export function escapeText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// 한글은 한 글자가 3바이트라 글자 수가 아니라 바이트 수로 자른다. 글자 중간에서 자르지 않는다
export function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let limit = MAX_LINE_BYTES;
  for (const char of line) {
    if (encoder.encode(current + char).length > limit) {
      parts.push(current);
      current = '';
      limit = MAX_LINE_BYTES - 1; // 이어지는 줄은 맨 앞 공백 1바이트를 뺀다
    }
    current += char;
  }
  parts.push(current);
  return parts.join(`${CRLF} `);
}

function utcStamp(at: Date) {
  return at.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
