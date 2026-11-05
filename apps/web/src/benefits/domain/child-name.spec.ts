import { describe, expect, it } from 'vitest';
import { callNameOf, withTopicParticle } from './child-name';

describe('callNameOf', () => {
  it('태어나기 전에는 태명으로 부른다 (이름을 적어 뒀어도)', () => {
    expect(callNameOf({ nickname: '콩이', name: '지우', born: false })).toBe('콩이');
  });

  it('태어나면 이름, 이름이 없으면 태명', () => {
    expect(callNameOf({ nickname: '콩이', name: '지우', born: true })).toBe('지우');
    expect(callNameOf({ nickname: '콩이', name: ' ', born: true })).toBe('콩이');
  });

  it('둘 다 없으면 "우리 아이"', () => {
    expect(callNameOf({ nickname: '  ', name: '', born: true })).toBe('우리 아이');
  });

  it('앞뒤 공백은 뗀다', () => {
    expect(callNameOf({ nickname: ' 튼튼 ', name: '', born: false })).toBe('튼튼');
  });
});

describe('withTopicParticle', () => {
  it.each([
    ['콩이', '콩이는'],
    ['튼튼', '튼튼은'],
    ['우리 아이', '우리 아이는'],
    ['복덩', '복덩은'],
    ['Joy', 'Joy은(는)'],
    ['쑥쑥2', '쑥쑥2은(는)'],
  ])('%s → %s', (word, text) => {
    expect(withTopicParticle(word)).toBe(text);
  });
});
