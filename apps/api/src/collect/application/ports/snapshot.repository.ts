import type { FieldChange } from '../../../shared/domain/payload-diff';
import type { SourceId } from '../../../shared/domain/source-id';
import type { SourceRecord, StoredItem } from '../../domain/source-record';

// 비즈니스 로직이 저장소에 요구하는 것. 구현(Prisma 등)은 infrastructure에서 한다.
// Nest가 이 추상 클래스를 주입 토큰으로도 쓴다.

export interface PlannedRecord {
  record: SourceRecord;
  hash: string;
}

// 수집 한 번의 결과를 저장소에 반영하기 위한 계획
export interface SnapshotPlan {
  recordChanges: boolean; // false면 항목만 저장하고 변경 내역은 남기지 않는다 (첫 수집)
  added: PlannedRecord[]; // 처음 보거나 다시 나타난 항목
  updated: (PlannedRecord & { changedFields: FieldChange[] })[];
  unchangedIds: string[];
  removedIds: string[];
}

export interface RunSummary {
  itemCount: number;
  added: number;
  updated: number;
  removed: number;
}

export abstract class SnapshotRepository {
  abstract loadItems(source: SourceId): Promise<StoredItem[]>;
  abstract startRun(source: SourceId): Promise<string>;
  abstract saveSnapshot(runId: string, source: SourceId, plan: SnapshotPlan): Promise<void>;
  abstract completeRun(runId: string, summary: RunSummary): Promise<void>;
  abstract failRun(runId: string, message: string): Promise<void>;
}
