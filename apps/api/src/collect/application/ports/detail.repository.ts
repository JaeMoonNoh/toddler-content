import type { FieldChange, Payload } from '../../../shared/domain/comparison-rule';
import type { SourceId } from '../../../shared/domain/source-id';
import type { SourceRecord } from '../../domain/source-record';

export interface DetailSnapshot {
  source: SourceId;
  record: SourceRecord;
  fetchedAt: Date;
  changedFields: FieldChange[]; // 비어 있으면 변경 내역을 남기지 않는다 (처음 받았거나 바뀐 것이 없음)
}

// 항목마다 가장 최근에 받은 상세 하나만 둔다. 바뀐 필드는 따로 쌓는다
export abstract class DetailRepository {
  abstract findPayload(source: SourceId, externalId: string): Promise<Payload | null>;
  abstract save(snapshot: DetailSnapshot): Promise<void>;
}
