import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { isDetailSource } from '../../../shared/domain/source-id';
import { SourceStateReader } from '../../application/ports/source-state.reader';
import { CurrentSources } from '../../domain/current-sources';
import { SourceRef } from '../../domain/source-ref';

@Injectable()
export class PrismaSourceStateReader extends SourceStateReader {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async read(refs: SourceRef[]): Promise<CurrentSources> {
    if (refs.length === 0) return new CurrentSources([]);

    const [rows, details] = await Promise.all([this.readItems(refs), this.readDetails(refs)]);
    return new CurrentSources(
      rows.map((row) => {
        const ref = new SourceRef(row.source, row.externalId);
        return {
          ref,
          payload: row.payload as Record<string, unknown>,
          detail: details.get(ref.key) ?? null,
          removed: row.removedAt !== null,
        };
      }),
    );
  }

  private readItems(refs: SourceRef[]) {
    return this.prisma.sourceItem.findMany({
      where: { OR: refs.map(({ source, externalId }) => ({ source, externalId })) },
      select: { source: true, externalId: true, payload: true, removedAt: true },
    });
  }

  private async readDetails(refs: SourceRef[]): Promise<Map<string, Record<string, unknown>>> {
    const withDetail = refs.filter((ref) => isDetailSource(ref.source));
    if (withDetail.length === 0) return new Map();

    const rows = await this.prisma.sourceDetail.findMany({
      where: { OR: withDetail.map(({ source, externalId }) => ({ source, externalId })) },
      select: { source: true, externalId: true, payload: true },
    });
    return new Map(rows.map((row) => [new SourceRef(row.source, row.externalId).key, row.payload as Record<string, unknown>]));
  }
}
