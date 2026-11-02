import { Injectable, Logger } from '@nestjs/common';
import { ChangeType, DataSource, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { assertNotShrunk, diffSnapshot, hashPayload, type SourceRecord } from './snapshot-diff';

const CHUNK = 1000;

function chunks<T>(items: T[], size = CHUNK): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export interface SnapshotResult {
  runId: string;
  baseline: boolean; // 이 출처의 첫 수집이라 변경 기록 없이 기준점만 저장했는지
  itemCount: number;
  added: number;
  updated: number;
  removed: number;
  duplicateIds: string[];
}

// 출처에서 받은 전체 목록을 저장된 원본과 비교해 반영하고, 변경 내역을 남긴다
@Injectable()
export class SnapshotService {
  private readonly logger = new Logger(SnapshotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async apply(source: DataSource, records: SourceRecord[], ignored: readonly string[] = []): Promise<SnapshotResult> {
    const run = await this.prisma.collectionRun.create({ data: { source } });
    try {
      const result = await this.applyInRun(run.id, source, records, ignored);
      await this.prisma.collectionRun.update({
        where: { id: run.id },
        data: {
          status: 'SUCCEEDED',
          finishedAt: new Date(),
          itemCount: result.itemCount,
          added: result.added,
          updated: result.updated,
          removed: result.removed,
        },
      });
      this.logger.log(
        `${source} 수집 완료: ${result.itemCount}건 (추가 ${result.added}, 변경 ${result.updated}, 삭제 ${result.removed})` +
          (result.baseline ? ' — 첫 수집이라 기준점만 저장' : ''),
      );
      return result;
    } catch (error) {
      await this.prisma.collectionRun.update({
        where: { id: run.id },
        data: { status: 'FAILED', finishedAt: new Date(), error: String(error instanceof Error ? error.message : error) },
      });
      throw error;
    }
  }

  private async applyInRun(
    runId: string,
    source: DataSource,
    records: SourceRecord[],
    ignored: readonly string[],
  ): Promise<SnapshotResult> {
    const existing = await this.prisma.sourceItem.findMany({
      where: { source },
      select: { id: true, externalId: true, hash: true, payload: true, removedAt: true },
    });
    const previous = existing.map((e) => ({
      externalId: e.externalId,
      hash: e.hash,
      payload: e.payload as Record<string, unknown>,
      removed: e.removedAt !== null,
    }));
    const baseline = existing.length === 0;

    assertNotShrunk(previous.filter((p) => !p.removed).length, records.length);
    const diff = diffSnapshot(previous, records, ignored);
    const idByExternalId = new Map(existing.map((e) => [e.externalId, e.id]));
    const now = new Date();

    const itemData = (r: SourceRecord) => ({
      name: r.name,
      payload: r.payload as Prisma.InputJsonValue,
      hash: hashPayload(r.payload, ignored),
      lastSeenAt: now,
    });

    await this.prisma.$transaction(
      async (tx) => {
        const changes: Prisma.SourceChangeCreateManyInput[] = [];

        // 처음 보는 항목
        const brandNew = diff.added.filter((r) => !idByExternalId.has(r.externalId));
        for (const part of chunks(brandNew)) {
          await tx.sourceItem.createMany({
            data: part.map((r) => ({ source, externalId: r.externalId, ...itemData(r), firstSeenAt: now })),
          });
          const created = await tx.sourceItem.findMany({
            where: { source, externalId: { in: part.map((r) => r.externalId) } },
            select: { id: true, externalId: true },
          });
          created.forEach((c) => idByExternalId.set(c.externalId, c.id));
        }

        // 사라졌다가 다시 나타난 항목
        for (const r of diff.added.filter((r) => !brandNew.includes(r))) {
          await tx.sourceItem.update({ where: { id: idByExternalId.get(r.externalId) }, data: { ...itemData(r), removedAt: null } });
        }
        if (!baseline) {
          diff.added.forEach((r) => changes.push({ type: ChangeType.ADDED, itemId: idByExternalId.get(r.externalId)!, runId }));
        }

        // 내용이 바뀐 항목
        for (const { record, changedFields } of diff.updated) {
          const itemId = idByExternalId.get(record.externalId)!;
          await tx.sourceItem.update({ where: { id: itemId }, data: itemData(record) });
          changes.push({
            type: ChangeType.UPDATED,
            itemId,
            runId,
            changedFields: changedFields as unknown as Prisma.InputJsonValue,
          });
        }

        // 그대로인 항목은 마지막으로 본 시각만 갱신
        for (const part of chunks(diff.unchanged)) {
          await tx.sourceItem.updateMany({
            where: { source, externalId: { in: part.map((r) => r.externalId) } },
            data: { lastSeenAt: now },
          });
        }

        // 목록에서 사라진 항목
        for (const part of chunks(diff.removed)) {
          await tx.sourceItem.updateMany({
            where: { source, externalId: { in: part.map((r) => r.externalId) } },
            data: { removedAt: now },
          });
        }
        diff.removed.forEach((r) => changes.push({ type: ChangeType.REMOVED, itemId: idByExternalId.get(r.externalId)!, runId }));

        for (const part of chunks(changes)) await tx.sourceChange.createMany({ data: part });
      },
      { timeout: 120_000 },
    );

    if (diff.duplicateIds.length) this.logger.warn(`${source} 중복 ID ${diff.duplicateIds.length}건: 첫 번째 항목만 저장`);

    return {
      runId,
      baseline,
      itemCount: records.length,
      added: diff.added.length,
      updated: diff.updated.length,
      removed: diff.removed.length,
      duplicateIds: diff.duplicateIds,
    };
  }
}
