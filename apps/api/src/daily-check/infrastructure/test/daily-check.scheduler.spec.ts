import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { describe, expect, it } from 'vitest';

import { BenefitReviewService } from '../../../benefit/application/benefit-review.service';
import { FakeSourceStateReader } from '../../../benefit/application/test/fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from '../../../benefit/application/test/fakes/in-memory-benefit.repository';
import { CollectService } from '../../../collect/application/collect.service';
import { FakeSourceFetcher } from '../../../collect/application/test/fakes/fake-source-fetcher';
import { InMemorySnapshotRepository } from '../../../collect/application/test/fakes/in-memory-snapshot.repository';
import { RecordingCollectionEvents } from '../../../collect/application/test/fakes/recording-collection-events';
import { ReportPrinter } from '../../../collect/infrastructure/cli/report-printer';
import { DailyCheckService } from '../../application/daily-check.service';
import { DailyCheckPrinter } from '../daily-check-printer';
import { DailyCheckScheduler } from '../daily-check.scheduler';

const record = { externalId: '1', name: '혜택 1', payload: { id: '1' } };

function schedulerWith(fetcher: FakeSourceFetcher) {
  const snapshots = new InMemorySnapshotRepository();
  const dailyCheck = new DailyCheckService(
    new CollectService(snapshots, [fetcher], new RecordingCollectionEvents()),
    new BenefitReviewService(new InMemoryBenefitRepository(), new FakeSourceStateReader()),
  );
  const scheduler = new DailyCheckScheduler(
    dailyCheck,
    new DailyCheckPrinter(new ReportPrinter()),
    new ConfigService({ COLLECT_SCHEDULE: 'on' }),
    new SchedulerRegistry(),
  );
  return { scheduler, snapshots };
}

const settled = async (promise: Promise<unknown>) => {
  let done = false;
  void promise.then(() => (done = true));
  await new Promise((resolve) => setTimeout(resolve, 10));
  return done;
};

describe('DailyCheckScheduler 종료', () => {
  it('수집 중이 아니면 바로 종료한다', async () => {
    const { scheduler } = schedulerWith(new FakeSourceFetcher('GOV24', [[record]]));
    expect(await settled(scheduler.beforeApplicationShutdown())).toBe(true);
  });

  it('수집 중이면 수집이 끝날 때까지 기다린 뒤 종료한다', async () => {
    let release!: () => void;
    const fetcher = new FakeSourceFetcher('GOV24', [[record]]).holdUntil(new Promise<void>((r) => (release = r)));
    const { scheduler, snapshots } = schedulerWith(fetcher);

    const run = scheduler.runDaily();
    const shutdown = scheduler.beforeApplicationShutdown();
    expect(await settled(shutdown)).toBe(false);

    release();
    await shutdown;
    expect(snapshots.runs.map((r) => r.status)).toEqual(['SUCCEEDED']);
    await run;
  });

  it('수집 중에 다시 실행되면 건너뛰고, 종료는 처음 수집을 기다린다', async () => {
    let release!: () => void;
    const fetcher = new FakeSourceFetcher('GOV24', [[record]]).holdUntil(new Promise<void>((r) => (release = r)));
    const { scheduler, snapshots } = schedulerWith(fetcher);

    const first = scheduler.runDaily();
    await scheduler.runDaily();
    const shutdown = scheduler.beforeApplicationShutdown();
    expect(await settled(shutdown)).toBe(false);

    release();
    await Promise.all([first, shutdown]);
    expect(snapshots.runs).toHaveLength(1);
  });

  it('수집이 끝난 뒤에는 바로 종료한다', async () => {
    const { scheduler } = schedulerWith(new FakeSourceFetcher('GOV24', [new Error('API 응답 없음')]));
    await scheduler.runDaily();
    expect(await settled(scheduler.beforeApplicationShutdown())).toBe(true);
  });
});
