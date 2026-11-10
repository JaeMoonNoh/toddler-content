import { Inject, Injectable } from '@nestjs/common';

import { ComparisonRule } from '../../shared/domain/comparison-rule';

import { type DetailOutcome, DetailRefreshReport, type DetailTarget, type RefreshedDetail } from './detail-refresh-report';
import { DetailEvents } from './ports/detail-events';
import { DETAIL_FETCHERS, type DetailFetcher } from './ports/detail-fetcher';
import { DetailRepository } from './ports/detail.repository';

import type { DetailSourceId, SourceId } from '../../shared/domain/source-id';

export class UnsupportedDetailSourceError extends Error {
  constructor(source: SourceId) {
    super(`상세를 받을 수 없는 출처입니다 (${source})`);
  }
}

// 출처 항목의 상세(본문)를 받아 이전 상세와 비교하고 저장한다.
// 목록에는 요약만 있는 출처(복지로)에서 지원대상·선정기준·지원내용이 바뀐 것을 잡으려고 쓴다
@Injectable()
export class SourceDetailService {
  constructor(
    private readonly repository: DetailRepository,
    @Inject(DETAIL_FETCHERS) private readonly fetchers: readonly DetailFetcher[],
    private readonly events: DetailEvents,
  ) {}

  get detailSources(): DetailSourceId[] {
    return this.fetchers.map((fetcher) => fetcher.source);
  }

  // 한 건씩 차례로 받는다. 한 건이 실패해도 나머지는 계속한다
  async refresh(targets: readonly DetailTarget[], at: Date): Promise<DetailRefreshReport> {
    const outcomes: DetailOutcome[] = [];
    for (const target of uniqueTargets(targets)) outcomes.push(await this.toOutcome(target, at));
    return new DetailRefreshReport(outcomes);
  }

  private async toOutcome(target: DetailTarget, at: Date): Promise<DetailOutcome> {
    try {
      const refreshed = await this.refreshOne(target, at);
      this.events.refreshed(refreshed);
      return refreshed;
    } catch (error) {
      const failed = { ...target, status: 'failed' as const, reason: error instanceof Error ? error.message : String(error) };
      this.events.failed(failed);
      return failed;
    }
  }

  private async refreshOne({ source, externalId }: DetailTarget, at: Date): Promise<RefreshedDetail> {
    const fetcher = this.fetcherOf(source);
    const record = await fetcher.fetchDetail(externalId);
    const previous = await this.repository.findPayload(source, externalId);
    const changedFields = previous ? ComparisonRule.ofDetail(fetcher.source).changedFields(previous, record.payload) : [];
    await this.repository.save({ source, record, fetchedAt: at, changedFields });

    const detail = { source, externalId, name: record.name };
    if (!previous) return { ...detail, status: 'baseline' };
    if (changedFields.length === 0) return { ...detail, status: 'unchanged' };
    return { ...detail, status: 'changed', fields: changedFields.map((change) => change.field) };
  }

  private fetcherOf(source: SourceId): DetailFetcher {
    const fetcher = this.fetchers.find((f) => f.source === source);
    if (!fetcher) throw new UnsupportedDetailSourceError(source);
    return fetcher;
  }
}

function uniqueTargets(targets: readonly DetailTarget[]): DetailTarget[] {
  const byKey = new Map(targets.map((target) => [`${target.source}:${target.externalId}`, target]));
  return [...byKey.values()];
}
