import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BenefitRepository } from '../../application/ports/benefit.repository';
import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';

import type { ApplicationPeriod } from '../../domain/application-period';
import type { Audience } from '../../domain/audience';
import type { BenefitAmount } from '../../domain/benefit-amount';
import type { BenefitSchedule } from '../../domain/benefit-schedule';
import type { EligibilityCondition } from '../../domain/eligibility-condition';
import type { HowToApply } from '../../domain/how-to-apply';

const WITH_SOURCES = { sources: { orderBy: { position: 'asc' } } } satisfies Prisma.BenefitInclude;
type BenefitRow = Prisma.BenefitGetPayload<{ include: typeof WITH_SOURCES }>;

@Injectable()
export class PrismaBenefitRepository extends BenefitRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Benefit[]> {
    return (await this.prisma.benefit.findMany({ include: WITH_SOURCES })).map(toBenefit);
  }

  async findBySlugs(slugs: string[]): Promise<Benefit[]> {
    return (await this.prisma.benefit.findMany({ where: { slug: { in: slugs } }, include: WITH_SOURCES })).map(toBenefit);
  }

  // 연결 원본은 혜택과 함께 지워진다 (onDelete: Cascade)
  async deleteBySlugs(slugs: string[]): Promise<void> {
    await this.prisma.benefit.deleteMany({ where: { slug: { in: slugs } } });
  }

  // 연결 원본은 지우고 다시 만든다. 혜택 하나에 원본이 몇 개뿐이라 이쪽이 단순하다
  async saveAll(benefits: Benefit[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const benefit of benefits) {
        const fields = {
          name: benefit.name,
          regionCode: benefit.regionCode,
          sourceUrl: benefit.sourceUrl,
          schedule: benefit.schedule ? (benefit.schedule as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
          conditions: benefit.conditions,
          audience: benefit.audience,
          amount: benefit.amount ? (benefit.amount as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
          applicationPeriod: benefit.applicationPeriod ? (benefit.applicationPeriod as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
          howToApply: benefit.howToApply ? (benefit.howToApply as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
          verifiedAt: benefit.verifiedAt,
        };
        const { id } = await tx.benefit.upsert({
          where: { slug: benefit.slug },
          create: { slug: benefit.slug, ...fields },
          update: fields,
        });
        await tx.benefitSource.deleteMany({ where: { benefitId: id } });
        await tx.benefitSource.createMany({ data: sourceRowsOf(benefit, id) });
      }
    });
  }
}

function sourceRowsOf(benefit: Benefit, benefitId: string): Prisma.BenefitSourceCreateManyInput[] {
  return benefit.sources.map((ref, position) => {
    const snapshot = benefit.verification?.snapshots.find((s) => s.ref.equals(ref));
    return {
      benefitId,
      position,
      source: ref.source,
      externalId: ref.externalId,
      verifiedPayload: snapshot ? (snapshot.payload as Prisma.InputJsonValue) : Prisma.DbNull,
      verifiedDetail: snapshot?.detail ? (snapshot.detail as Prisma.InputJsonValue) : Prisma.DbNull,
    };
  });
}

function toBenefit(row: BenefitRow): Benefit {
  const sources = row.sources.map((s) => ({ ref: new SourceRef(s.source, s.externalId), row: s }));
  const details = {
    slug: row.slug,
    name: row.name,
    regionCode: row.regionCode,
    sourceUrl: row.sourceUrl,
    sources: sources.map((s) => s.ref),
    schedule: (row.schedule ?? null) as BenefitSchedule | null,
    conditions: row.conditions as EligibilityCondition[],
    amount: (row.amount ?? null) as BenefitAmount | null,
    applicationPeriod: (row.applicationPeriod ?? null) as ApplicationPeriod | null,
    howToApply: (row.howToApply ?? null) as HowToApply | null,
    audience: (row.audience ?? null) as Audience | null,
    plannedOn: null, // NOTE: 정리 작업에만 쓰는 값이라 DB에 두지 않는다 (목록 파일에만 있다)
  };
  const snapshots = sources
    .filter((s) => s.row.verifiedPayload !== null)
    .map((s) => ({
      ref: s.ref,
      payload: s.row.verifiedPayload as Record<string, unknown>,
      detail: (s.row.verifiedDetail ?? null) as Record<string, unknown> | null,
    }));

  return Benefit.restore(details, row.verifiedAt ? { verifiedAt: row.verifiedAt, snapshots } : null);
}
