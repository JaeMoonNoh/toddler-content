import { Injectable } from '@nestjs/common';

import { SavedConditions } from '../domain/saved-conditions';

import { ConditionsRepository, type StoredConditions } from './ports/conditions-repository';

export class ConsentRequiredError extends Error {}

@Injectable()
export class ConditionsService {
  constructor(private readonly repository: ConditionsRepository) {}

  find(userId: string): Promise<null | StoredConditions> {
    return this.repository.find(userId);
  }

  // 처음 저장할 때는 동의가 있어야 한다. 그 뒤로는 처음 동의한 시각을 그대로 둔다
  async save(userId: string, input: unknown, consented: boolean, now: Date): Promise<StoredConditions> {
    const conditions = SavedConditions.parse(input);
    const existing = await this.repository.find(userId);
    if (!existing && !consented) throw new ConsentRequiredError('조건을 저장하려면 먼저 동의해 주세요');
    return this.repository.save(userId, conditions, existing?.consentedAt ?? now, now);
  }

  // 저장한 조건을 지우면 동의도 거둔 것으로 본다. 다시 저장하려면 다시 동의한다
  delete(userId: string): Promise<void> {
    return this.repository.delete(userId);
  }
}
