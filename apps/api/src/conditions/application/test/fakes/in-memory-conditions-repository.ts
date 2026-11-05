import { ConditionsRepository, type StoredConditions } from '../../ports/conditions-repository';

import type { SavedConditions } from '../../../domain/saved-conditions';

export class InMemoryConditionsRepository extends ConditionsRepository {
  readonly rows = new Map<string, StoredConditions>();

  async find(userId: string): Promise<null | StoredConditions> {
    return this.rows.get(userId) ?? null;
  }

  async save(userId: string, conditions: SavedConditions, consentedAt: Date, now: Date): Promise<StoredConditions> {
    const row = { conditions, consentedAt, updatedAt: now };
    this.rows.set(userId, row);
    return row;
  }

  async delete(userId: string): Promise<void> {
    this.rows.delete(userId);
  }
}
