import type { SavedConditions } from '../../domain/saved-conditions';

export interface StoredConditions {
  conditions: SavedConditions;
  consentedAt: Date;
  updatedAt: Date;
}

export abstract class ConditionsRepository {
  abstract find(userId: string): Promise<null | StoredConditions>;

  abstract save(userId: string, conditions: SavedConditions, consentedAt: Date, now: Date): Promise<StoredConditions>;

  abstract delete(userId: string): Promise<void>;
}
