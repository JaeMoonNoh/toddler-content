import { ComparisonRule } from '../../shared/domain/comparison-rule';

import { type ApplicationPeriod, periodProblems, samePeriod } from './application-period';
import { type Audience, audienceProblems } from './audience';
import { amountProblems, type BenefitAmount, sameAmount } from './benefit-amount';
import { type BenefitSchedule, sameSchedule, scheduleProblems } from './benefit-schedule';
import { conditionProblems, type EligibilityCondition, sameConditions } from './eligibility-condition';
import { type HowToApply, howToApplyProblems, sameHowToApply } from './how-to-apply';
import { type ChangedSource, isPublishable, type ReviewStatus } from './review-status';

import type { CurrentSources, SourceSnapshot, SourceState } from './current-sources';
import type { SourceRef } from './source-ref';

export interface BenefitDetails {
  slug: string;
  name: string;
  regionCode: string; // 어느 지역 혜택인지. 법정동코드 10자리 (전국 0000000000). 있는 코드인지는 지역 목록으로 확인한다
  sourceUrl: string; // 사용자에게 보여줄 원문 링크
  sources: SourceRef[]; // 첫 번째가 대표 출처
  schedule: BenefitSchedule | null; // 신청 기간 규칙. 아직 정리하지 않았으면 null
  conditions: EligibilityCondition[]; // 받기 위한 조건. 없으면 빈 배열
  amount: BenefitAmount | null; // 받는 금액. 아직 정리하지 않았으면 null
  applicationPeriod: ApplicationPeriod | null; // 해마다 공고하는 사업의 올해 신청 기간. 상시 신청이면 null
  howToApply: HowToApply | null; // 어디서 어떻게 신청하는지. 아직 정리하지 않았으면 null
  audience: Audience | null; // 특정 대상만 받는 혜택의 묶음. 누구나 받을 수 있으면 null
}

export interface Verification {
  verifiedAt: Date;
  snapshots: SourceSnapshot[];
}

export class InvalidBenefitError extends Error {}

export class NotVerifiableError extends Error {
  constructor(
    readonly slug: string,
    readonly status: ReviewStatus,
  ) {
    super(`원본이 ${status.kind === 'SOURCE_REMOVED' ? '출처에서 사라져서' : '수집돼 있지 않아서'} 확인할 수 없습니다`);
  }
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REGION_CODE = /^\d{10}$/;

// 사이트에 올리는 혜택 한 건. 어떤 원본을 근거로 하는지와, 사람이 언제 어떤 원본을 보고 확인했는지를 가진다
export class Benefit {
  private constructor(
    readonly details: BenefitDetails,
    readonly verification: Verification | null,
  ) {}

  static register(details: BenefitDetails): Benefit {
    assertValid(details);
    return new Benefit(details, null);
  }

  static restore(details: BenefitDetails, verification: Verification | null): Benefit {
    return new Benefit(details, verification);
  }

  get slug() {
    return this.details.slug;
  }

  get name() {
    return this.details.name;
  }

  get regionCode() {
    return this.details.regionCode;
  }

  get sourceUrl() {
    return this.details.sourceUrl;
  }

  get schedule() {
    return this.details.schedule;
  }

  get audience() {
    return this.details.audience;
  }

  get applicationPeriod() {
    return this.details.applicationPeriod;
  }

  get howToApply() {
    return this.details.howToApply;
  }

  get amount() {
    return this.details.amount;
  }

  get conditions() {
    return this.details.conditions;
  }

  get sources() {
    return this.details.sources;
  }

  get primarySource() {
    return this.details.sources[0];
  }

  get verifiedAt() {
    return this.verification?.verifiedAt ?? null;
  }

  // none: 그대로, audience: 대상 묶음만 바뀜, content: 사람이 다시 확인해야 하는 정보가 바뀜
  changeKind(details: BenefitDetails): 'none' | 'audience' | 'content' {
    if (!sameDetails(this.details, details)) return 'content';
    return details.audience === this.audience ? 'none' : 'audience';
  }

  // 혜택 정보가 바뀌면 사람이 다시 확인해야 한다. 대상 묶음은 보여주는 자리일 뿐이라 확인 기록을 유지한다
  revise(details: BenefitDetails): Benefit {
    if (details.slug !== this.slug) throw new InvalidBenefitError(`slug는 바꿀 수 없습니다: ${this.slug} → ${details.slug}`);
    switch (this.changeKind(details)) {
      case 'none':
        return this;
      case 'content':
        return Benefit.register(details);
      case 'audience':
        assertValid(details);
        return new Benefit(details, this.verification);
    }
  }

  reviewStatus(current: CurrentSources): ReviewStatus {
    const missing = this.sources.filter((ref) => !current.of(ref));
    if (missing.length) return { kind: 'SOURCE_MISSING', refs: missing };

    const removed = this.sources.filter((ref) => current.of(ref)!.removed);
    if (removed.length) return { kind: 'SOURCE_REMOVED', refs: removed };

    const verified = this.verifiedSnapshots();
    if (!verified) return { kind: 'UNVERIFIED' };

    const changes = verified
      .map((snapshot) => changeBetween(snapshot, current.of(snapshot.ref)!))
      .filter((change): change is ChangedSource => change !== null);
    return changes.length ? { kind: 'SOURCE_CHANGED', changes } : { kind: 'VERIFIED' };
  }

  verify(current: CurrentSources, at: Date): Benefit {
    const status = this.reviewStatus(current);
    if (status.kind === 'SOURCE_MISSING' || status.kind === 'SOURCE_REMOVED') throw new NotVerifiableError(this.slug, status);

    const snapshots = this.sources.map((ref) => {
      const { payload } = current.of(ref)!;
      return { ref, payload };
    });
    return new Benefit(this.details, { verifiedAt: at, snapshots });
  }

  isPublished(current: CurrentSources) {
    return isPublishable(this.reviewStatus(current));
  }

  // 지금 연결된 원본마다 확인 당시 모습이 있어야 확인된 것으로 본다
  private verifiedSnapshots(): SourceSnapshot[] | null {
    if (!this.verification) return null;
    const snapshots = this.sources.map((ref) => this.verification!.snapshots.find((s) => s.ref.equals(ref)));
    return snapshots.every((s) => s !== undefined) ? snapshots : null;
  }
}

function changeBetween(verified: SourceSnapshot, now: SourceState): ChangedSource | null {
  const rule = ComparisonRule.of(verified.ref.source);
  if (rule.isSame(verified.payload, now.payload)) return null;
  return { ref: verified.ref, fields: rule.changedFields(verified.payload, now.payload) };
}

function assertValid(details: BenefitDetails) {
  const problems = [
    !SLUG.test(details.slug) && `slug는 영어 소문자, 숫자, -만 쓸 수 있습니다: "${details.slug}"`,
    !details.name.trim() && '이름이 비어 있습니다',
    !REGION_CODE.test(details.regionCode) && `지역 코드는 법정동코드 10자리여야 합니다: "${details.regionCode}"`,
    !details.sourceUrl.startsWith('https://') && `원문 링크는 https 주소여야 합니다: "${details.sourceUrl}"`,
    details.sources.length === 0 && '연결된 원본이 없습니다',
    new Set(details.sources.map((ref) => ref.key)).size !== details.sources.length && '같은 원본이 두 번 연결돼 있습니다',
    ...(details.schedule ? scheduleProblems(details.schedule) : []),
    ...conditionProblems(details.conditions),
    ...(details.amount ? amountProblems(details.amount) : []),
    ...(details.applicationPeriod ? periodProblems(details.applicationPeriod) : []),
    ...(details.howToApply ? howToApplyProblems(details.howToApply) : []),
    ...audienceProblems(details.audience),
  ].filter((problem): problem is string => Boolean(problem));
  if (problems.length) throw new InvalidBenefitError(`${details.slug}: ${problems.join(', ')}`);
}

function sameDetails(a: BenefitDetails, b: BenefitDetails) {
  const keys = (d: BenefitDetails) => d.sources.map((ref) => ref.key).join(',');
  return (
    a.name === b.name &&
    a.regionCode === b.regionCode &&
    a.sourceUrl === b.sourceUrl &&
    keys(a) === keys(b) &&
    sameSchedule(a.schedule, b.schedule) &&
    sameConditions(a.conditions, b.conditions) &&
    sameAmount(a.amount, b.amount) &&
    samePeriod(a.applicationPeriod, b.applicationPeriod) &&
    sameHowToApply(a.howToApply, b.howToApply)
  );
}
