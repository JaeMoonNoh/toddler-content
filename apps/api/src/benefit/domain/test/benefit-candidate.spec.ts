import { describe, expect, it } from 'vitest';

import { candidateStrengthOf, serviceNameKey } from '../benefit-candidate';

const text = (name: string, detail = '', lifeStages = '') => ({ name, detail, lifeStages });

describe('candidateStrengthOf', () => {
  it.each([
    ['이름에 임신·출산 단어', text('임산부 교통비 지원')],
    ['이름에 난임', text('한의약 난임 치료 지원')],
    ['복지로 생애주기가 임신·출산', text('다자녀 가정 양육비', '', '임신 · 출산, 영유아')],
  ])('%s이면 강함', (_, t) => {
    expect(candidateStrengthOf(t)).toBe('strong');
  });

  it.each([
    ['설명에만 출산 단어', text('천사지원금 지급', '출생아 가정에 지원')],
    ['이름에 보육', text('부모부담보육료 지원')],
    ['생애주기가 영유아만', text('장난감 대여', '', '영유아')],
  ])('%s이면 후보', (_, t) => {
    expect(candidateStrengthOf(t)).toBe('possible');
  });

  it.each([
    ['관련 없는 혜택', text('어르신 교통비 지원', '65세 이상')],
    ['노인 돌봄', text('고독사 예방을 위한 AI 안부확인 돌봄서비스')],
    ['빈 값', text('')],
  ])('%s은 후보가 아니다', (_, t) => {
    expect(candidateStrengthOf(t)).toBeNull();
  });
});

describe('serviceNameKey', () => {
  it('띄어쓰기, 문장부호, 끝의 "지원·사업"을 무시한다', () => {
    expect(serviceNameKey('산모·신생아 건강관리 지원')).toBe(serviceNameKey('산모신생아 건강관리'));
    expect(serviceNameKey('임산부 교통비 지원사업')).toBe(serviceNameKey('임산부 교통비 지원'));
  });

  it('앞에 붙은 지역 이름을 무시한다', () => {
    expect(serviceNameKey('인천광역시 임산부 교통비 지원')).toBe(serviceNameKey('임산부 교통비 지원사업'));
    expect(serviceNameKey('충청북도 청주시 시간제보육 지원')).toBe(serviceNameKey('시간제보육'));
  });

  it('지역 이름이 이름 안에 붙어 있으면 지우지 않는다', () => {
    expect(serviceNameKey('강화군민 출산장려금')).toBe('강화군민출산장려금');
  });

  it('다른 혜택은 다르게 본다', () => {
    expect(serviceNameKey('산후조리비 지원')).not.toBe(serviceNameKey('산후조리원 이용료 지원'));
  });
});
