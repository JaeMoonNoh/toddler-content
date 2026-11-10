import { describe, expect, it } from 'vitest';

import { benefitDetails } from '../../application/test/fakes/benefit-fixtures';
import { SourceRef } from '../../domain/source-ref';
import { CHANGE_RULES_PATH, fieldCountOf, toChangeTextFiles } from '../cli/change-text-printer';

import type { FieldChange } from '../../../shared/domain/comparison-rule';
import type { ChangedCard } from '../../application/benefit-review.service';

const basis = { text: '근거', url: 'https://plus.gov.kr/benefit?svcId=1' };
const changed = (id: string, fields: FieldChange[], ref = new SourceRef('GOV24', id)): ChangedCard => ({
  card: benefitDetails(id),
  changes: [{ ref, fields }],
});
const amountChange: FieldChange = { field: '지원내용', before: '최대 30만원 지원', after: '최대 50만원 지원' };
const regionNames = new Map([['4100000000', '경기도']]);

describe('toChangeTextFiles', () => {
  it('바뀐 카드가 없으면 파일을 만들지 않는다', () => {
    expect(toChangeTextFiles([], regionNames)).toEqual([]);
  });

  it('정한 건수씩 나누고, 딱 맞으면 빈 파일을 더 만들지 않는다', () => {
    const items = ['1', '2', '3', '4', '5'].map((id) => changed(id, [amountChange]));

    expect(toChangeTextFiles(items, regionNames, 2).map(({ name }) => name)).toEqual(['changes-1.md', 'changes-2.md', 'changes-3.md']);
    expect(toChangeTextFiles(items.slice(0, 4), regionNames, 2)).toHaveLength(2);
    expect(toChangeTextFiles(items, regionNames, 2)[2].text).toContain('# 원본 바뀜 판단 3/3 (1건)\n');
    expect(toChangeTextFiles(items, regionNames, 2)[2].text).toContain('## 1. 혜택 5');
  });

  it('머리말에 판단 규칙 문서와 표기법을 알린다', () => {
    const [file] = toChangeTextFiles([changed('1', [amountChange])], regionNames);
    expect(file.text).toContain(`판단 규칙: ${CHANGE_RULES_PATH}. 표기: [-지운 말-]{+더한 말+}`);
  });

  it('카드의 slug, 지역 이름, 원문 링크와 지금 카드 값을 보여준다', () => {
    const item: ChangedCard = {
      card: benefitDetails('1', {
        name: '출산지원금',
        regionCode: '4100000000',
        amount: { kind: 'cash', summary: '30만원', tiers: [{ minBirthOrder: 1, maxBirthOrder: null, won: 300_000 }], basis },
        schedule: {
          from: { anchor: 'birth', months: 0, days: 0 },
          until: { anchor: 'birth', months: 0, days: 59 },
          untilLabel: '신청 마감 (출산 후 60일)',
          summary: '출생 후 60일 안에 신청해요',
          basis,
        },
        applicationPeriod: { start: '2026-01-01', end: '2026-12-31', basis },
        howToApply: { summary: '주민센터 방문', basis },
        audience: 'MULTI_CHILD',
        conditions: ['USES_CHILDCARE'],
      }),
      changes: [{ ref: new SourceRef('GOV24', '1'), fields: [amountChange] }],
    };
    const [{ text }] = toChangeTextFiles([item], regionNames);

    expect(text).toContain(
      '## 1. 출산지원금\n- slug: `gov24-1`\n- 지역: 경기도 (4100000000)\n- 원문 링크: https://plus.gov.kr/benefit?svcId=1',
    );
    expect(text).toContain('- 금액(amount): 30만원 / 합계: 모든 아이 300,000원');
    expect(text).toContain('- 일정(schedule): 출생 후 60일 안에 신청해요 (신청 마감 (출산 후 60일))');
    expect(text).toContain('- 올해 신청 기간(applicationPeriod): 2026-01-01 ~ 2026-12-31');
    expect(text).toContain('- 신청 방법(howToApply): 주민센터 방문');
    expect(text).toContain('- 대상 묶음(audience): MULTI_CHILD');
    expect(text).toContain('- 조건(conditions): USES_CHILDCARE');
  });

  it('정리하지 않은 카드 값은 없음, 모르는 지역은 코드만', () => {
    const [{ text }] = toChangeTextFiles([changed('1', [amountChange])], regionNames);

    expect(text).toContain('- 지역: 0000000000\n');
    expect(text).toContain('- 금액(amount): 없음\n- 일정(schedule): 없음');
    expect(text).toContain('- 대상 묶음(audience): 없음 (누구나)\n- 조건(conditions): 없음');
  });

  it('바뀐 필드마다 바뀐 말만 보여준다', () => {
    const [{ text }] = toChangeTextFiles([changed('1', [amountChange])], regionNames);
    expect(text).toContain('### 바뀐 원문 (보조금24 1)\n- 지원내용: 최대 [-30-]{+50+}만원 지원');
  });

  it('복지로 상세 필드는 한글 이름과 원래 이름을 함께, 모르는 필드는 원래 이름만 보여준다', () => {
    const fields: FieldChange[] = [
      { field: '상세.alwServCn', before: '10만원', after: '20만원' },
      { field: '상세.tgtrDtlCn', before: '임산부', after: '출산 가정' },
      { field: '상세.enfcEndYmd', before: '20261231', after: '20271231' },
      { field: '상세.newField', before: null, after: '값' },
      { field: 'servDgst', before: '요약 하나', after: '요약 둘' },
      { field: '전화문의', before: '129', after: '120' },
    ];
    const [{ text }] = toChangeTextFiles([changed('1', fields, new SourceRef('BOKJIRO_LOCAL', 'WLF1'))], regionNames);

    expect(text).toContain('### 바뀐 원문 (복지로 WLF1)');
    expect(text).toContain('- 지원내용 (상세 alwServCn): [-10-]{+20+}만원');
    expect(text).toContain('- 지원대상 (상세 tgtrDtlCn): ');
    expect(text).toContain('- 사업 기간(끝) (상세 enfcEndYmd): [-20261231-]{+20271231+}');
    expect(text).toContain('- newField (상세 newField): {+값+}');
    expect(text).toContain('- 요약 (servDgst): 요약 [-하나-]{+둘+}');
    expect(text).toContain('- 전화문의: [-129-]{+120+}');
  });

  it('띄어쓰기·줄바꿈만 바뀐 필드는 그렇다고 적는다', () => {
    const [{ text }] = toChangeTextFiles(
      [changed('1', [{ field: '지원내용', before: '30만원\n지원', after: '30만원 지원' }])],
      regionNames,
    );
    expect(text).toContain('- 지원내용: 띄어쓰기·줄바꿈만 바뀜');
  });
});

describe('fieldCountOf', () => {
  it('카드와 원본을 가로질러 바뀐 필드 수를 센다', () => {
    const two: ChangedCard = {
      card: benefitDetails('1'),
      changes: [
        { ref: new SourceRef('GOV24', '1'), fields: [amountChange] },
        { ref: new SourceRef('BOKJIRO_LOCAL', 'W'), fields: [amountChange] },
      ],
    };
    expect(fieldCountOf([two, changed('2', [amountChange])])).toBe(3);
    expect(fieldCountOf([])).toBe(0);
  });
});
