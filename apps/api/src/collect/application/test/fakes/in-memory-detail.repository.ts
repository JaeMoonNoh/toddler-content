import { DetailRepository, type DetailSnapshot } from '../../ports/detail.repository';

import type { FieldChange, Payload } from '../../../../shared/domain/comparison-rule';
import type { SourceId } from '../../../../shared/domain/source-id';

export interface MemoryDetail {
  name: string;
  payload: Payload;
  fetchedAt: Date;
  changedAt: Date | null;
}

export interface MemoryDetailChange {
  key: string;
  changedFields: FieldChange[];
  detectedAt: Date;
}

// 테스트용 저장소. Prisma 구현과 같은 규칙을 메모리에서 따른다
export class InMemoryDetailRepository extends DetailRepository {
  readonly details = new Map<string, MemoryDetail>();
  readonly changes: MemoryDetailChange[] = [];

  static keyOf(source: SourceId, externalId: string) {
    return `${source}:${externalId}`;
  }

  async findPayload(source: SourceId, externalId: string): Promise<Payload | null> {
    return this.details.get(InMemoryDetailRepository.keyOf(source, externalId))?.payload ?? null;
  }

  async save({ source, record, fetchedAt, changedFields }: DetailSnapshot): Promise<void> {
    const key = InMemoryDetailRepository.keyOf(source, record.externalId);
    const changed = changedFields.length > 0;
    const changedAt = changed ? fetchedAt : (this.details.get(key)?.changedAt ?? null);
    this.details.set(key, { name: record.name, payload: record.payload, fetchedAt, changedAt });
    if (changed) this.changes.push({ key, changedFields, detectedAt: fetchedAt });
  }
}
