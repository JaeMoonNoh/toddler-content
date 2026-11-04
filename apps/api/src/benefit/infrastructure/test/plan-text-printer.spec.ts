import { describe, expect, it } from 'vitest';

import { benefitDetails } from '../../application/test/fakes/benefit-fixtures';
import { SourceRef } from '../../domain/source-ref';
import { printCardsToPlan } from '../cli/plan-text-printer';

describe('printCardsToPlan', () => {
  const text = printCardsToPlan(
    [
      {
        card: benefitDetails('1', {
          name: '출산지원금',
          regionCode: '4100000000',
          audience: 'MULTI_CHILD',
          conditions: ['USES_CHILDCARE'],
        }),
        sources: [
          { ref: new SourceRef('GOV24', '1'), payload: { 신청기한: '출생일로부터\r\n\n\n  1년   이내', 지원내용: '50만원' } },
          { ref: new SourceRef('BOKJIRO_LOCAL', 'WLF1'), payload: null },
        ],
      },
    ],
    '경기 카드 원문 1/1',
  );

  it('카드의 slug, 원문 링크, 대상 묶음과 조건을 보여준다', () => {
    expect(text).toContain('# 경기 카드 원문 1/1 (1건)');
    expect(text).toContain('## 1. 출산지원금\n- slug: `gov24-1`\n- 지역코드: 4100000000\n- 원문 링크: https://plus.gov.kr/benefit?svcId=1');
    expect(text).toContain('- 대상 묶음: MULTI_CHILD / 조건: USES_CHILDCARE');
  });

  it('원문 필드를 줄바꿈과 공백을 줄여 보여주고, 빈 필드는 (없음)', () => {
    expect(text).toContain('### 원문 (보조금24 1)\n- 신청기한: 출생일로부터\n1년 이내\n- 지원대상: (없음)');
  });

  it('수집돼 있지 않은 원본을 알린다', () => {
    expect(text).toContain('### 원문 복지로 지자체 WLF1: 수집돼 있지 않음');
  });

  it('대상 묶음이 없으면 누구나', () => {
    expect(printCardsToPlan([{ card: benefitDetails('2'), sources: [] }], 't')).toContain('- 대상 묶음: 없음 (누구나)');
  });
});
