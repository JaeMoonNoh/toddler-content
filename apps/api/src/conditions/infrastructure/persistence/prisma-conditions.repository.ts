import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConditionsRepository, type StoredConditions } from '../../application/ports/conditions-repository';
import { SavedConditions } from '../../domain/saved-conditions';

@Injectable()
export class PrismaConditionsRepository extends ConditionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async find(userId: string): Promise<null | StoredConditions> {
    const row = await this.prisma.userConditions.findUnique({ where: { userId } });
    if (!row) return null;
    return { conditions: SavedConditions.parse(row.conditions), consentedAt: row.consentedAt, updatedAt: row.updatedAt };
  }

  async save(userId: string, conditions: SavedConditions, consentedAt: Date, now: Date): Promise<StoredConditions> {
    const data = { conditions: conditions.toJSON() as unknown as Prisma.InputJsonValue, consentedAt, updatedAt: now };
    await this.prisma.userConditions.upsert({ where: { userId }, create: { userId, ...data }, update: data });
    return { conditions, consentedAt, updatedAt: now };
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.userConditions.deleteMany({ where: { userId } });
  }
}
