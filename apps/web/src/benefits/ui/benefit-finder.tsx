'use client';

import { useMemo, useRef, useState } from 'react';
import { receiptOf } from '../domain/amount';
import { splitByAudience } from '../domain/audience';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { answeredCount, splitByEligibility, UNANSWERED } from '../domain/eligibility';
import { describeStage, pregnancyStage } from '../domain/pregnancy';
import { type RegionDirectory, RegionTree } from '../domain/region';
import { ALL_TAB, buildTimeline, OTHER_TAB, tabsOf } from '../domain/timeline';
import { BenefitGroups } from './benefit-groups';
import { CalendarDownload } from './calendar-download';
import { ExcludedBenefits } from './excluded-benefits';
import { AmountReceipt } from './amount-receipt';
import { AudienceGroups } from './audience-groups';
import { BirthOrderField, ChildcareField, HouseholdFields } from './household-fields';
import { PhaseTabs } from './phase-tabs';
import { type RegionPick, RegionField } from './region-field';
import { TimelineCard } from './timeline-card';

// 사는 곳, 출산예정일, 고용보험 답은 이 화면(브라우저) 안에서만 쓰고 서버로 보내지 않는다
export function BenefitFinder({ benefits, regions }: { benefits: PublishedBenefit[]; regions: RegionDirectory }) {
  const tree = useMemo(() => new RegionTree(regions.regions), [regions]);
  const [pick, setPick] = useState<RegionPick>({ provinceCode: '', districtCode: '' });
  const [dueText, setDueText] = useState('');
  const [household, setHousehold] = useState(UNANSWERED);
  const [tab, setTab] = useState(ALL_TAB);
  const listRef = useRef<HTMLElement>(null);

  const region = tree.choose(pick.districtCode || pick.provinceCode || null);
  const today = CalendarDate.today();
  const due = CalendarDate.parse(dueText);
  const stage = due ? pregnancyStage(due, today) : null;
  const { shown, excluded } = splitByEligibility(
    benefits.filter((b) => region.covers(b)),
    household,
  );
  const timeline = due && stage?.kind !== 'too-far' ? buildTimeline(region, shown, due, today) : null;
  const receipt = receiptOf(shown, household);
  const rest = splitByAudience((timeline ? timeline.unscheduled : shown).filter((b) => region.covers(b)));
  const listed = region.groupsOf(rest.forEveryone);
  const scheduledCount = timeline?.phases.reduce((sum, phase) => sum + phase.items.length, 0) ?? 0;
  const listedCount = listed.reduce((sum, group) => sum + group.benefits.length, 0);
  const otherCount = listedCount + rest.groups.reduce((sum, group) => sum + group.benefits.length, 0);
  const tabs = timeline ? tabsOf(timeline, otherCount) : [];
  // 지역이나 날짜를 바꿔 고른 탭이 사라지면 전체로 돌아간다
  const active = tabs.some((t) => t.label === tab) ? tab : ALL_TAB;
  const shows = (label: string) => active === ALL_TAB || active === label;

  const selectTab = (label: string) => {
    setTab(label);
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollTo({ top: window.scrollY + top });
  };

  return (
    <div className="wrap">
      <aside className="side">
        <form className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <RegionField tree={tree} pick={pick} choice={region} prepared={region.isPrepared(benefits)} onChange={setPick} />
          <div className="field">
            <label htmlFor="due">출산예정일</label>
            <input id="due" type="date" value={dueText} onChange={(e) => setDueText(e.target.value)} />
            <p className="stage" aria-live="polite">
              {stage ? describeStage(stage) : '출산예정일을 넣으면 신청 일정을 날짜로 계산해 드려요'}
            </p>
          </div>
          <details className="more-fields">
            <summary>
              더 정확하게 보기 <span>{answeredCount(household) ? `${answeredCount(household)}개 답함` : '선택'}</span>
            </summary>
            <BirthOrderField household={household} onChange={setHousehold} />
            <HouseholdFields household={household} onChange={setHousehold} />
            <ChildcareField household={household} onChange={setHousehold} />
          </details>
        </form>
        <AmountReceipt receipt={receipt} birthOrderKnown={household.birthOrder !== null} />
        {timeline && <CalendarDownload timeline={timeline} />}
        <p className="notice">
          일정은 아이가 출산예정일에 태어난다고 보고 계산해요. 실제 출생일이 다르면 그만큼 밀리거나 당겨져요.
        </p>
      </aside>

      <section className="list" aria-label="혜택" ref={listRef}>
        {timeline && <PhaseTabs tabs={tabs} active={active} onSelect={selectTab} />}
        {timeline && active !== OTHER_TAB && (
          <section aria-labelledby="timeline-title">
            <div className="listhead">
              <h2 id="timeline-title">신청 타임라인</h2>
              <p>{scheduledCount}건</p>
            </div>
            {timeline.phases.length === 0 && <p className="empty">이 지역에서 일정을 정리한 혜택이 아직 없어요.</p>}
            {timeline.phases.filter((phase) => shows(phase.tab)).map((phase) => (
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

        {shows(OTHER_TAB) && (
          <>
            <div className="listhead">
              <h2>{timeline ? '그 밖에 받을 수 있는 혜택' : '받을 수 있는 혜택'}</h2>
              <p>{listedCount}건</p>
            </div>
            {timeline && <p className="hint">아래 혜택은 신청 일정을 아직 정리하는 중이에요. 원문에서 기간을 확인해 주세요.</p>}
            {listed.length === 0 && <p className="empty">이 지역에 보여드릴 혜택이 아직 없어요.</p>}
            <BenefitGroups groups={listed} />
            <AudienceGroups groups={rest.groups} />
            <ExcludedBenefits excluded={excluded} />
          </>
        )}
      </section>
    </div>
  );
}
