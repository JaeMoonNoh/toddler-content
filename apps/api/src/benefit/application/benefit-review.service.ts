import { Injectable } from '@nestjs/common';

import { needsReview, type ReviewStatus, type ReviewStatusKind } from '../domain/review-status';

import { BenefitRepository } from './ports/benefit.repository';
import { SourceStateReader } from './ports/source-state.reader';

import type { Benefit } from '../domain/benefit';
import type { SourceState } from '../domain/current-sources';
import type { SourceRef } from '../domain/source-ref';

export interface ReviewItem {
  slug: string;
  name: string;
  verifiedAt: Date | null;
  status: ReviewStatus;
}

export interface ReviewQueue {
  items: ReviewItem[]; // 급한 것부터
  counts: Record<ReviewStatusKind, number>;
}

export interface BenefitDetail {
  benefit: Benefit;
  status: ReviewStatus;
  sources: { ref: SourceRef; state: SourceState | null }[]; // 연결된 원본의 지금 모습. 수집된 적 없으면 null
}

export interface VerifyResult {
  verified: string[];
  failed: { slug: string; reason: string }[];
}

// 게시가 멈춘 것(원본 없음, 사라짐)부터, 그 다음 확인 뒤 내용이 바뀐 것, 마지막이 검증 전으로 게시 중인 것
const URGENCY: ReviewStatusKind[] = ['SOURCE_MISSING', 'SOURCE_REMOVED', 'SOURCE_CHANGED', 'UNVERIFIED', 'VERIFIED'];

// 사람이 혜택을 원문과 맞춰 보고 확인하는 일
@Injectable()
export class BenefitReviewService {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  // 사람이 확인해야 할 혜택 목록
  async queue(): Promise<ReviewQueue> {
    const benefits = await this.repository.findAll();
    const current = await this.reader.read(benefits.flatMap((benefit) => benefit.sources));
    const all = benefits.map((benefit) => toReviewItem(benefit, benefit.reviewStatus(current)));

    return {
      items: all.filter((item) => needsReview(item.status)).sort(byUrgencyThenName),
      counts: countByKind(all),
    };
  }

  // 혜택 하나를 검증할 때 필요한 것을 한 번에 모은다: 우리가 정리한 내용과 지금 원문
  async detail(slug: string): Promise<BenefitDetail | null> {
    const [benefit] = await this.repository.findBySlugs([slug]);
    if (!benefit) return null;

    const current = await this.reader.read(benefit.sources);
    return {
      benefit,
      status: benefit.reviewStatus(current),
      sources: benefit.sources.map((ref) => ({ ref, state: current.of(ref) ?? null })),
    };
  }

  // 사람이 원문을 보고 확인한 혜택에 확인일과 그때 원본 모습을 남긴다. 확인할 수 없는 것만 빼고 나머지는 반영한다
  async verify(slugs: string[], at: Date): Promise<VerifyResult> {
    const wanted = [...new Set(slugs)];
    const found = await this.repository.findBySlugs(wanted);
    const current = await this.reader.read(found.flatMap((benefit) => benefit.sources));
    const bySlug = new Map(found.map((benefit) => [benefit.slug, benefit]));

    const result: VerifyResult = { verified: [], failed: [] };
    const toSave: Benefit[] = [];
    for (const slug of wanted) {
      const benefit = bySlug.get(slug);
      if (!benefit) {
        result.failed.push({ slug, reason: '없는 혜택입니다' });
        continue;
      }
      try {
        toSave.push(benefit.verify(current, at));
        result.verified.push(slug);
      } catch (error) {
        result.failed.push({ slug, reason: error instanceof Error ? error.message : String(error) });
      }
    }

    if (toSave.length) await this.repository.saveAll(toSave);
    return result;
  }
}

function toReviewItem(benefit: Benefit, status: ReviewStatus): ReviewItem {
  return { slug: benefit.slug, name: benefit.name, verifiedAt: benefit.verifiedAt, status };
}

function byUrgencyThenName(a: ReviewItem, b: ReviewItem) {
  return URGENCY.indexOf(a.status.kind) - URGENCY.indexOf(b.status.kind) || a.name.localeCompare(b.name, 'ko');
}

function countByKind(items: ReviewItem[]) {
  const counts = Object.fromEntries(URGENCY.map((kind) => [kind, 0])) as Record<ReviewStatusKind, number>;
  items.forEach((item) => counts[item.status.kind]++);
  return counts;
}
