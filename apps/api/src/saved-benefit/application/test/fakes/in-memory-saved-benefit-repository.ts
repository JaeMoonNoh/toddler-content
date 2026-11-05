import { SavedBenefitRepository } from '../../ports/saved-benefit-repository';

import type { SavedBenefit } from '../../../domain/saved-benefit';

export class InMemorySavedBenefitRepository extends SavedBenefitRepository {
  readonly rows = new Map<string, Map<string, SavedBenefit['state']>>();

  async list(userId: string): Promise<SavedBenefit[]> {
    return [...(this.rows.get(userId) ?? [])].map(([slug, state]) => ({ slug, state }));
  }

  async upsert(userId: string, items: SavedBenefit[], _now: Date): Promise<void> {
    const rows = this.rows.get(userId) ?? new Map<string, SavedBenefit['state']>();
    for (const { slug, state } of items) rows.set(slug, state);
    this.rows.set(userId, rows);
  }

  async delete(userId: string, slug: string): Promise<void> {
    this.rows.get(userId)?.delete(slug);
  }
}
