import type { SavedBenefit } from '../../domain/saved-benefit';

export abstract class SavedBenefitRepository {
  abstract list(userId: string): Promise<SavedBenefit[]>;

  // 있으면 상태를 바꾸고 없으면 더한다
  abstract upsert(userId: string, items: SavedBenefit[], now: Date): Promise<void>;

  abstract delete(userId: string, slug: string): Promise<void>;
}
