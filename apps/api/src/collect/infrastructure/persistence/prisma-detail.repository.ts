import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { DetailRepository, type DetailSnapshot, type StoredDetail } from '../../application/ports/detail.repository';

import type { Payload } from '../../../shared/domain/comparison-rule';
import type { SourceId } from '../../../shared/domain/source-id';

@Injectable()
export class PrismaDetailRepository extends DetailRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findPayload(source: SourceId, externalId: string): Promise<Payload | null> {
    const row = await this.prisma.sourceDetail.findUnique({
      where: { source_externalId: { source, externalId } },
      select: { payload: true },
    });
    return row ? (row.payload as Payload) : null;
  }

  async findBySources(sources: readonly SourceId[]): Promise<StoredDetail[]> {
    const rows = await this.prisma.sourceDetail.findMany({
      where: { source: { in: [...sources] } },
      select: { source: true, externalId: true, payload: true, fetchedAt: true },
    });
    return rows.map((row) => ({ ...row, payload: row.payload as Payload }));
  }

  // 최신 상세와 변경 내역을 한 트랜잭션으로 남겨서, 상세만 바뀌고 변경 내역이 빠지는 일이 없게 한다
  async save({ source, record, fetchedAt, changedFields }: DetailSnapshot): Promise<void> {
    const changed = changedFields.length > 0;
    const latest = {
      name: record.name,
      payload: record.payload as Prisma.InputJsonValue,
      fetchedAt,
      ...(changed && { changedAt: fetchedAt }),
    };

    await this.prisma.$transaction(async (tx) => {
      const { id } = await tx.sourceDetail.upsert({
        where: { source_externalId: { source, externalId: record.externalId } },
        create: { source, externalId: record.externalId, ...latest },
        update: latest,
        select: { id: true },
      });
      if (changed) {
        await tx.sourceDetailChange.create({
          data: { detailId: id, changedFields: changedFields as unknown as Prisma.InputJsonValue, detectedAt: fetchedAt },
        });
      }
    });
  }
}
