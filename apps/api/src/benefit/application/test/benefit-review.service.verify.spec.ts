import { beforeEach, describe, expect, it } from 'vitest';

import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';
import { BenefitReviewService } from '../benefit-review.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const at = new Date('2026-11-02T03:00:00Z');
const later = new Date('2026-11-05T03:00:00Z');
const ref = (id: string) => new SourceRef('GOV24', id);

describe('BenefitReviewService.verify', () => {
  let repo: InMemoryBenefitRepository;
  let reader: FakeSourceStateReader;
  const verify = (slugs: string[], when = at) => new BenefitReviewService(repo, reader).verify(slugs, when);

  beforeEach(() => {
    repo = new InMemoryBenefitRepository(['1', '2'].map((id) => Benefit.register(benefitDetails(id))));
    reader = new FakeSourceStateReader().set(ref('1'), { 지원내용: 'a' }).set(ref('2'));
  });

  it('확인일과 그때 원본 모습을 저장한다', async () => {
    expect(await verify(['gov24-1'])).toEqual({ verified: ['gov24-1'], failed: [] });

    const saved = repo.benefits.get('gov24-1')!;
    expect(saved.verifiedAt).toBe(at);
    expect(saved.verification!.snapshots[0]).toMatchObject({ payload: { 지원내용: 'a' } });
    expect(repo.benefits.get('gov24-2')!.verifiedAt).toBeNull();
  });

  it('없는 혜택은 실패로 알려주고 나머지는 확인한다', async () => {
    expect(await verify(['gov24-1', 'gov24-404'])).toEqual({
      verified: ['gov24-1'],
      failed: [{ slug: 'gov24-404', reason: '없는 혜택입니다' }],
    });
    expect(repo.benefits.get('gov24-1')!.verifiedAt).toBe(at);
  });

  it('원본이 사라진 혜택은 확인하지 않는다', async () => {
    reader.remove(ref('2'));
    const result = await verify(['gov24-2']);

    expect(result.verified).toEqual([]);
    expect(result.failed[0].reason).toContain('사라져서');
    expect(repo.saveCount).toBe(0);
  });

  it('같은 slug를 여러 번 넣어도 한 번만 확인한다', async () => {
    expect((await verify(['gov24-1', 'gov24-1'])).verified).toEqual(['gov24-1']);
  });

  it('아무것도 넣지 않으면 저장하지 않는다', async () => {
    expect(await verify([])).toEqual({ verified: [], failed: [] });
    expect(repo.saveCount).toBe(0);
  });

  it('원본이 바뀐 혜택을 다시 확인하면 새 원본 모습과 확인일로 바뀐다', async () => {
    await verify(['gov24-1']);
    reader.set(ref('1'), { 지원내용: 'b' });
    await verify(['gov24-1'], later);

    const saved = repo.benefits.get('gov24-1')!;
    expect(saved.verifiedAt).toBe(later);
    expect(saved.verification!.snapshots[0]).toMatchObject({ payload: { 지원내용: 'b' } });
  });
});
