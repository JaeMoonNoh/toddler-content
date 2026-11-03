import { formatKstDate } from '../../../shared/format-kst';
import type { BenefitDetail } from '../../application/benefit-review.service';
import type { ApplicationPeriod } from '../../domain/application-period';
import type { BenefitAmount } from '../../domain/benefit-amount';
import type { BenefitSchedule, ScheduleOffset } from '../../domain/benefit-schedule';
import type { SourceState } from '../../domain/current-sources';
import type { SourceRef } from '../../domain/source-ref';

// 검증할 때 볼 원문 필드. 출처마다 이름이 다르다
const KEY_FIELDS: Record<SourceRef['source'], string[]> = {
  GOV24: ['지원대상', '선정기준', '지원내용', '신청기한', '신청방법', '접수기관'],
  BOKJIRO_NATIONAL: ['servDgst', 'lifeArray', 'trgterIndvdlArray', 'jurMnofNm'],
  BOKJIRO_LOCAL: ['servDgst', 'lifeNmArray', 'trgterIndvdlNmArray', 'ctpvNm', 'sggNm'],
};

const STATUS_LABEL: Record<BenefitDetail['status']['kind'], string> = {
  VERIFIED: '확인됨',
  UNVERIFIED: '검증 전',
  SOURCE_CHANGED: '확인 뒤 원본 바뀜',
  SOURCE_REMOVED: '원본 사라짐',
  SOURCE_MISSING: '원본 없음',
};

const KIND_LABEL: Record<BenefitAmount['kind'], string> = { cash: '현금', voucher: '이용권', service: '서비스', wage: '임금 대신 받는 급여' };

// 우리가 정리한 내용(위)과 지금 원문(아래)을 나란히 보여준다. 위아래가 맞으면 verify하면 된다
export class BenefitDetailPrinter {
  constructor(private readonly maxFieldLength = 500) {}

  print({ benefit, status, sources }: BenefitDetail): string {
    const verified = benefit.verifiedAt ? `, 마지막 확인 ${formatKstDate(benefit.verifiedAt)}` : '';
    return [
      `■ ${benefit.name}  (${benefit.slug})`,
      `  상태: ${STATUS_LABEL[status.kind]}${verified}`,
      `  지역: ${benefit.scope}   원문 링크: ${benefit.sourceUrl}`,
      `  조건: ${benefit.conditions.length ? benefit.conditions.join(', ') : '없음'}`,
      '',
      '[우리가 정리한 일정]',
      ...scheduleLines(benefit.schedule),
      '',
      '[우리가 정리한 금액]',
      ...amountLines(benefit.amount),
      '',
      '[우리가 정리한 올해 신청 기간]',
      ...periodLines(benefit.applicationPeriod),
      '',
      ...sources.flatMap(({ ref, state }) => this.sourceLines(ref, state)),
      `원문과 맞으면: pnpm benefit verify ${benefit.slug}`,
    ].join('\n');
  }

  private sourceLines(ref: SourceRef, state: SourceState | null): string[] {
    const head = `[지금 원문 · ${ref.label} ${ref.externalId}]`;
    if (!state) return [head, '  수집된 적 없는 원본이에요. 목록 파일의 ID를 확인해 주세요.', ''];
    const removed = state.removed ? ['  ⚠ 출처 목록에서 사라졌어요.'] : [];
    const fields = KEY_FIELDS[ref.source]
      .filter((field) => ![undefined, null, '', 'null'].includes(state.payload[field] as string))
      .map((field) => `  ${field}: ${this.shorten(state.payload[field])}`);
    return [head, ...removed, ...(fields.length ? fields : ['  (보여줄 필드가 없어요)']), ''];
  }

  private shorten(value: unknown) {
    const text = (typeof value === 'string' ? value : JSON.stringify(value)).replace(/\s+/g, ' ').trim();
    return text.length > this.maxFieldLength ? `${text.slice(0, this.maxFieldLength)}…` : text;
  }
}

function scheduleLines(schedule: BenefitSchedule | null): string[] {
  if (!schedule) return ['  아직 정리하지 않았어요'];
  return [
    `  기간: ${describeOffset(schedule.from)} ~ ${describeOffset(schedule.until)} (${schedule.untilLabel})`,
    `  설명: ${schedule.summary}`,
    `  근거: ${schedule.basis.text}`,
    `        ${schedule.basis.url}`,
  ];
}

function periodLines(period: ApplicationPeriod | null): string[] {
  if (!period) return ['  없음 (상시 신청이거나 아직 정리하지 않았어요)'];
  return [`  기간: ${period.start} ~ ${period.end}`, `  근거: ${period.basis.text}`, `        ${period.basis.url}`];
}

function amountLines(amount: BenefitAmount | null): string[] {
  if (!amount) return ['  아직 정리하지 않았어요'];
  const tiers = amount.tiers
    ? amount.tiers.map((t) => `${birthOrderRange(t.minBirthOrder, t.maxBirthOrder)} ${t.won.toLocaleString('ko-KR')}원`).join(', ')
    : '합계에서 뺌 (받는 사람마다 금액이 달라서 숫자로 정하지 않음)';
  return [`  ${KIND_LABEL[amount.kind]}: ${amount.summary}`, `  합계에 넣는 금액: ${tiers}`, `  근거: ${amount.basis.text}`, `        ${amount.basis.url}`];
}

const ORDINALS = ['', '첫째', '둘째', '셋째', '넷째', '다섯째'];
const ordinal = (n: number) => ORDINALS[n] ?? `${n}째`;

// 구간이 하나뿐이면 "출생 순위 상관없이", 아니면 "첫째", "둘째 이상", "첫째~둘째"
function birthOrderRange(min: number, max: number | null) {
  if (min === 1 && max === null) return '출생 순위 상관없이';
  if (max === null) return `${ordinal(min)} 이상`;
  return min === max ? ordinal(min) : `${ordinal(min)}~${ordinal(max)}`;
}

// "출생일 + 24개월 - 1일", "임신 시작(출산예정일 280일 전)"
export function describeOffset({ anchor, months, days }: ScheduleOffset): string {
  const base = anchor === 'birth' ? '출생일' : '임신 시작(출산예정일 280일 전)';
  const parts = [months && `${months > 0 ? '+' : '-'} ${Math.abs(months)}개월`, days && `${days > 0 ? '+' : '-'} ${Math.abs(days)}일`].filter(Boolean);
  return [base, ...parts].join(' ');
}
