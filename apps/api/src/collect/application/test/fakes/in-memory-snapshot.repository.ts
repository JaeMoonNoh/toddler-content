import type { StoredItem } from '../../../domain/source-record';
import type { FieldChange } from '../../../../shared/domain/payload-diff';
import type { SourceId } from '../../../../shared/domain/source-id';
import { SnapshotRepository, type RunSummary, type SnapshotPlan } from '../../ports/snapshot.repository';

// 테스트용 저장소. Prisma 구현과 같은 규칙을 메모리에서 따른다.

interface MemoryItem extends StoredItem {
  source: SourceId;
}

export interface MemoryChange {
  runId: string;
  type: 'ADDED' | 'UPDATED' | 'REMOVED';
  externalId: string;
  changedFields?: FieldChange[];
}

export interface MemoryRun {
  id: string;
  source: SourceId;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  summary?: RunSummary;
  error?: string;
}

export class InMemorySnapshotRepository extends SnapshotRepository {
  items = new Map<string, MemoryItem>();
  changes: MemoryChange[] = [];
  runs: MemoryRun[] = [];
  failNextSave: Error | null = null;

  private key(source: SourceId, externalId: string) {
    return `${source}:${externalId}`;
  }

  async loadItems(source: SourceId): Promise<StoredItem[]> {
    return [...this.items.values()]
      .filter((i) => i.source === source)
      .map(({ externalId, name, hash, payload, removed }) => ({ externalId, name, hash, payload, removed }));
  }

  async startRun(source: SourceId): Promise<string> {
    const id = `run-${this.runs.length + 1}`;
    this.runs.push({ id, source, status: 'RUNNING' });
    return id;
  }

  async saveSnapshot(runId: string, source: SourceId, plan: SnapshotPlan): Promise<void> {
    if (this.failNextSave) {
      const error = this.failNextSave;
      this.failNextSave = null;
      throw error; // 실제 저장소의 트랜잭션처럼 아무것도 반영하지 않는다
    }
    for (const { record, hash } of plan.added) {
      this.items.set(this.key(source, record.externalId), {
        source,
        externalId: record.externalId,
        name: record.name,
        payload: record.payload,
        hash,
        removed: false,
      });
      if (plan.recordChanges) this.changes.push({ runId, type: 'ADDED', externalId: record.externalId });
    }
    for (const { record, hash, changedFields } of plan.updated) {
      const item = this.items.get(this.key(source, record.externalId))!;
      Object.assign(item, { name: record.name, payload: record.payload, hash });
      if (plan.recordChanges) this.changes.push({ runId, type: 'UPDATED', externalId: record.externalId, changedFields });
    }
    for (const externalId of plan.removedIds) {
      this.items.get(this.key(source, externalId))!.removed = true;
      if (plan.recordChanges) this.changes.push({ runId, type: 'REMOVED', externalId });
    }
  }

  async completeRun(runId: string, summary: RunSummary): Promise<void> {
    Object.assign(this.runs.find((r) => r.id === runId)!, { status: 'SUCCEEDED', summary });
  }

  async failRun(runId: string, message: string): Promise<void> {
    Object.assign(this.runs.find((r) => r.id === runId)!, { status: 'FAILED', error: message });
  }
}
