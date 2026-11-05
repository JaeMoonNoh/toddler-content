import { Injectable } from '@nestjs/common';

import {
  InvalidSavedBenefitError,
  MAX_SAVED_BENEFITS,
  mergeSavedBenefits,
  type SavedBenefit,
  toSavedBenefit,
} from '../domain/saved-benefit';

import { SavedBenefitRepository } from './ports/saved-benefit-repository';

@Injectable()
export class SavedBenefitService {
  constructor(private readonly repository: SavedBenefitRepository) {}

  list(userId: string): Promise<SavedBenefit[]> {
    return this.repository.list(userId);
  }

  async set(userId: string, slug: unknown, state: unknown, now: Date): Promise<SavedBenefit> {
    const item = toSavedBenefit(slug, state);
    const existing = await this.repository.list(userId);
    if (!existing.some((saved) => saved.slug === item.slug)) rejectOverLimit(existing.length + 1);
    await this.repository.upsert(userId, [item], now);
    return item;
  }

  remove(userId: string, slug: string): Promise<void> {
    return this.repository.delete(userId, slug);
  }

  // 로그인하기 전 이 기기에 저장해 둔 혜택을 계정으로 옮긴다
  async mergeFromDevice(userId: string, items: unknown, now: Date): Promise<SavedBenefit[]> {
    if (!Array.isArray(items)) throw new InvalidSavedBenefitError('items는 목록이어야 합니다');
    const device = items.map((item: { slug?: unknown; state?: unknown } | null) => toSavedBenefit(item?.slug, item?.state));
    const merged = mergeSavedBenefits(await this.repository.list(userId), device);
    rejectOverLimit(merged.length);
    await this.repository.upsert(userId, merged, now);
    return merged;
  }
}

function rejectOverLimit(count: number) {
  if (count > MAX_SAVED_BENEFITS) throw new InvalidSavedBenefitError(`혜택은 ${MAX_SAVED_BENEFITS}개까지 저장할 수 있습니다`);
}
