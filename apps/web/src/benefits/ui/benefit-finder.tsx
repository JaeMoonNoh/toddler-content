'use client';

import { useState } from 'react';
import { receiptOf } from '../domain/amount';
import { splitByAudience } from '../domain/audience';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { splitByEligibility, UNANSWERED } from '../domain/eligibility';
import { describeStage, pregnancyStage } from '../domain/pregnancy';
import { groupForRegion, REGIONS } from '../domain/region';
import { buildTimeline } from '../domain/timeline';
import { BenefitGroups } from './benefit-groups';
import { CalendarDownload } from './calendar-download';
import { ExcludedBenefits } from './excluded-benefits';
import { AmountReceipt } from './amount-receipt';
import { AudienceGroups } from './audience-groups';
import { BirthOrderField, ChildcareField, HouseholdFields } from './household-fields';
import { TimelineCard } from './timeline-card';

// 사는 곳, 출산예정일, 고용보험 답은 이 화면(브라우저) 안에서만 쓰고 서버로 보내지 않는다
export function BenefitFinder({ benefits }: { benefits: PublishedBenefit[] }) {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [dueText, setDueText] = useState('');
  const [household, setHousehold] = useState(UNANSWERED);

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const today = CalendarDate.today();
  const due = CalendarDate.parse(dueText);
  const stage = due ? pregnancyStage(due, today) : null;
  const { shown, excluded } = splitByEligibility(
    benefits.filter((b) => region.scopes.includes(b.scope)),
    household,
  );
  const timeline = due && stage?.kind !== 'too-far' ? buildTimeline(region, shown, due, today) : null;
  const receipt = receiptOf(shown, household);
  const rest = splitByAudience((timeline ? timeline.unscheduled : shown).filter((b) => region.scopes.includes(b.scope)));
  const listed = groupForRegion(region, rest.forEveryone);
  const scheduledCount = timeline?.phases.reduce((sum, phase) => sum + phase.items.length, 0) ?? 0;

  return (
    <div className="wrap">
      <aside className="side">
        <form className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label htmlFor="region">사는 곳</label>
            <select id="region" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="due">출산예정일</label>
            <input id="due" type="date" value={dueText} onChange={(e) => setDueText(e.target.value)} />
            <p className="stage" aria-live="polite">
              {stage ? describeStage(stage) : '출산예정일을 넣으면 신청 일정을 날짜로 계산해 드려요'}
            </p>
          </div>
          <BirthOrderField household={household} onChange={setHousehold} />
          <HouseholdFields household={household} onChange={setHousehold} />
          <ChildcareField household={household} onChange={setHousehold} />
        </form>
        <AmountReceipt receipt={receipt} birthOrderKnown={household.birthOrder !== null} />
        {timeline && <CalendarDownload timeline={timeline} />}
        <p className="notice">
          일정은 아이가 출산예정일에 태어난다고 보고 계산해요. 실제 출생일이 다르면 그만큼 밀리거나 당겨져요.
        </p>
      </aside>

      <section className="list" aria-label="혜택">
        {timeline && (
          <section aria-labelledby="timeline-title">
            <div className="listhead">
              <h2 id="timeline-title">신청 타임라인</h2>
              <p>{scheduledCount}건</p>
            </div>
            {timeline.phases.length === 0 && <p className="empty">이 지역에서 일정을 정리한 혜택이 아직 없어요.</p>}
            {timeline.phases.map((phase) => (
              <section key={phase.label} aria-label={phase.label}>
                <h3 className="phase">{phase.label}</h3>
                <ol className="tl">
                  {phase.items.map((item) => (
                    <TimelineCard key={item.benefit.slug} item={item} />
                  ))}
                </ol>
              </section>
            ))}
          </section>
        )}

        <div className="listhead">
          <h2>{timeline ? '그 밖에 받을 수 있는 혜택' : '받을 수 있는 혜택'}</h2>
          <p>{listed.reduce((sum, group) => sum + group.benefits.length, 0)}건</p>
        </div>
        {timeline && <p className="hint">아래 혜택은 신청 일정을 아직 정리하는 중이에요. 원문에서 기간을 확인해 주세요.</p>}
        {listed.length === 0 && <p className="empty">이 지역에 보여드릴 혜택이 아직 없어요.</p>}
        <BenefitGroups groups={listed} />
        <AudienceGroups groups={rest.groups} />
        <ExcludedBenefits excluded={excluded} />
      </section>
    </div>
  );
}
