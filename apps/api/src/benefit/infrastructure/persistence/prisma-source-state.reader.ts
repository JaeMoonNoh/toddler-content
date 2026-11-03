import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
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

    const rows = await this.prisma.sourceItem.findMany({
      where: { OR: refs.map(({ source, externalId }) => ({ source, externalId })) },
      select: { source: true, externalId: true, payload: true, removedAt: true },
    });
    return new CurrentSources(
      rows.map((row) => ({
        ref: new SourceRef(row.source, row.externalId),
        payload: row.payload as Record<string, unknown>,
        removed: row.removedAt !== null,
      })),
    );
  }
}
