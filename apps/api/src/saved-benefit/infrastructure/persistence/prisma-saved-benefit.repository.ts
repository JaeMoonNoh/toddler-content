import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { SavedBenefitRepository } from '../../application/ports/saved-benefit-repository';

import type { SavedBenefit } from '../../domain/saved-benefit';

@Injectable()
export class PrismaSavedBenefitRepository extends SavedBenefitRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async list(userId: string): Promise<SavedBenefit[]> {
    const rows = await this.prisma.savedBenefit.findMany({
      where: { userId },
      select: { slug: true, state: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(({ slug, state }) => ({ slug, state: state === 'APPLIED' ? 'applied' : 'todo' }));
  }

  async upsert(userId: string, items: SavedBenefit[], now: Date): Promise<void> {
    await this.prisma.$transaction(
      items.map(({ slug, state }) => {
        const data = { state: state === 'applied' ? ('APPLIED' as const) : ('TODO' as const), updatedAt: now };
        return this.prisma.savedBenefit.upsert({
          where: { userId_slug: { userId, slug } },
          create: { userId, slug, ...data, createdAt: now },
          update: data,
        });
      }),
    );
  }

  async delete(userId: string, slug: string): Promise<void> {
    await this.prisma.savedBenefit.deleteMany({ where: { userId, slug } });
  }
}
