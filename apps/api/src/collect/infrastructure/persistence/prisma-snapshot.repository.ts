import { Injectable } from '@nestjs/common';
import { ChangeType, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SnapshotRepository, type RunSummary, type SnapshotPlan } from '../../application/ports/snapshot.repository';
import type { StoredItem } from '../../domain/source-record';
import type { SourceId } from '../../../shared/domain/source-id';

const CHUNK = 1000; // 한 쿼리에 넣는 최대 건수 (PostgreSQL 파라미터 한도 대비)

function chunks<T>(items: T[], size = CHUNK): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

@Injectable()
export class PrismaSnapshotRepository extends SnapshotRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async loadItems(source: SourceId): Promise<StoredItem[]> {
    const rows = await this.prisma.sourceItem.findMany({
      where: { source },
      select: { externalId: true, name: true, hash: true, payload: true, removedAt: true },
    });
    return rows.map((r) => ({
      externalId: r.externalId,
      name: r.name,
      hash: r.hash,
      payload: r.payload as Record<string, unknown>,
      removed: r.removedAt !== null,
    }));
  }

  async startRun(source: SourceId): Promise<string> {
    return (await this.prisma.collectionRun.create({ data: { source } })).id;
  }

  async completeRun(runId: string, summary: RunSummary): Promise<void> {
    await this.prisma.collectionRun.update({
      where: { id: runId },
      data: {
        status: 'SUCCEEDED',
        finishedAt: new Date(),
        itemCount: summary.itemCount,
        added: summary.added,
        updated: summary.updated,
        removed: summary.removed,
      },
    });
  }

  async failRun(runId: string, message: string): Promise<void> {
    await this.prisma.collectionRun.update({
      where: { id: runId },
      data: { status: 'FAILED', finishedAt: new Date(), error: message },
    });
  }

  // 한 트랜잭션으로 반영해서, 중간에 실패하면 아무것도 바뀌지 않게 한다
  async saveSnapshot(runId: string, source: SourceId, plan: SnapshotPlan): Promise<void> {
    const now = new Date();
    const changes: Prisma.SourceChangeCreateManyInput[] = [];

    await this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.sourceItem.findMany({ where: { source }, select: { id: true, externalId: true } });
        const idOf = new Map(existing.map((e) => [e.externalId, e.id]));

        // 처음 보는 항목은 한꺼번에 만들고, 다시 나타난 항목은 하나씩 되살린다
        const brandNew = plan.added.filter((p) => !idOf.has(p.record.externalId));
        for (const part of chunks(brandNew)) {
          await tx.sourceItem.createMany({
            data: part.map(({ record, hash }) => ({
              source,
              externalId: record.externalId,
              name: record.name,
              payload: record.payload as Prisma.InputJsonValue,
              hash,
              firstSeenAt: now,
              lastSeenAt: now,
            })),
          });
          const created = await tx.sourceItem.findMany({
            where: { source, externalId: { in: part.map((p) => p.record.externalId) } },
            select: { id: true, externalId: true },
          });
          created.forEach((c) => idOf.set(c.externalId, c.id));
        }
        for (const { record, hash } of plan.added.filter((p) => !brandNew.includes(p))) {
          await tx.sourceItem.update({
            where: { id: idOf.get(record.externalId) },
            data: { name: record.name, payload: record.payload as Prisma.InputJsonValue, hash, lastSeenAt: now, removedAt: null },
          });
        }
        if (plan.recordChanges) {
          plan.added.forEach((p) => changes.push({ type: ChangeType.ADDED, itemId: idOf.get(p.record.externalId)!, runId }));
        }

        for (const { record, hash, changedFields } of plan.updated) {
          const itemId = idOf.get(record.externalId)!;
          await tx.sourceItem.update({
            where: { id: itemId },
            data: { name: record.name, payload: record.payload as Prisma.InputJsonValue, hash, lastSeenAt: now },
          });
          if (plan.recordChanges) {
            changes.push({ type: ChangeType.UPDATED, itemId, runId, changedFields: changedFields as unknown as Prisma.InputJsonValue });
          }
        }

        for (const part of chunks(plan.unchangedIds)) {
          await tx.sourceItem.updateMany({ where: { source, externalId: { in: part } }, data: { lastSeenAt: now } });
        }

        for (const part of chunks(plan.removedIds)) {
          await tx.sourceItem.updateMany({ where: { source, externalId: { in: part } }, data: { removedAt: now } });
        }
        if (plan.recordChanges) {
          plan.removedIds.forEach((id) => changes.push({ type: ChangeType.REMOVED, itemId: idOf.get(id)!, runId }));
        }

        for (const part of chunks(changes)) await tx.sourceChange.createMany({ data: part });
      },
      { timeout: 120_000 },
    );
  }
}
