'use client';

import { useMemo, useRef, useState } from 'react';
import { receiptOf } from '../domain/amount';
import { splitByAudience } from '../domain/audience';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { answeredCount, splitByEligibility, UNANSWERED } from '../domain/eligibility';
import { ChildDates } from '../domain/child-dates';
import { childStage, describeStage, hasSchedule } from '../domain/pregnancy';
import { type RegionDirectory, RegionTree } from '../domain/region';
import { ALL_TAB, buildTimeline, OTHER_TAB, SAVED_TAB, tabsOf, withoutBenefits } from '../domain/timeline';
import { BenefitGroups } from './benefit-groups';
import { ChildDatesField } from './child-dates-field';
import { CalendarDownload } from './calendar-download';
import { ExcludedBenefits } from './excluded-benefits';
import { AmountReceipt } from './amount-receipt';
import { AudienceGroups } from './audience-groups';
import { BirthOrderField, ChildcareField, HouseholdFields } from './household-fields';
import { PhaseTabs } from './phase-tabs';
import { type RegionPick, RegionField } from './region-field';
import { SavedBenefitsContext, useSavedBenefitsStore } from './saved-benefits-store';
import { SavedList } from './saved-list';
import { TimelineCard } from './timeline-card';

// 사는 곳, 출산예정일·출생일, 고용보험 답은 이 화면(브라우저) 안에서만 쓰고 서버로 보내지 않는다
export function BenefitFinder({ benefits, regions }: { benefits: PublishedBenefit[]; regions: RegionDirectory }) {
  const store = useSavedBenefitsStore();
  const { saved } = store;
  const tree = useMemo(() => new RegionTree(regions.regions), [regions]);
  const [pick, setPick] = useState<RegionPick>({ provinceCode: '', districtCode: '' });
  const [childInput, setChildInput] = useState({ dueText: '', born: false, birthText: '' });
  const [household, setHousehold] = useState(UNANSWERED);
  const [tab, setTab] = useState(ALL_TAB);
  const listRef = useRef<HTMLElement>(null);

  const region = tree.choose(pick.districtCode || pick.provinceCode || null);
  const today = CalendarDate.today();
  const dates = ChildDates.of(CalendarDate.parse(childInput.dueText), childInput.born ? CalendarDate.parse(childInput.birthText) : null);
  const stage = dates ? childStage(dates, today) : null;
  const { shown, excluded } = splitByEligibility(
    benefits.filter((b) => region.covers(b)),
    household,
  );
  const fullTimeline = dates && stage && hasSchedule(stage) ? buildTimeline(region, shown, dates, today) : null;
  // 저장한 혜택은 저장한 혜택 탭에만 보여주고 시기별 목록에서는 뺀다. 합계와 캘린더에는 그대로 넣는다
  const isSaved = (benefit: PublishedBenefit) => saved.has(benefit.slug);
  const savedItems = saved.listOf(shown, fullTimeline, today);
  const timeline = fullTimeline && withoutBenefits(fullTimeline, isSaved);
  const receipt = receiptOf(shown, household);
  const rest = splitByAudience((timeline ? timeline.unscheduled : shown.filter((b) => !isSaved(b))).filter((b) => region.covers(b)));
  const listed = region.groupsOf(rest.forEveryone);
  const scheduledCount = timeline?.phases.reduce((sum, phase) => sum + phase.items.length, 0) ?? 0;
  const listedCount = listed.reduce((sum, group) => sum + group.benefits.length, 0);
  const otherCount = listedCount + rest.groups.reduce((sum, group) => sum + group.benefits.length, 0);
  const tabs = tabsOf(timeline, otherCount, savedItems.length);
  // 지역이나 날짜를 바꿔 고른 탭이 사라지면 전체로 돌아간다
  const active = tabs.some((t) => t.label === tab) ? tab : ALL_TAB;
  const shows = (label: string) => active === ALL_TAB || active === label;
  const showsTimeline = timeline && (active === ALL_TAB || timeline.phases.some((phase) => phase.tab === active));

  const selectTab = (label: string) => {
    setTab(label);
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollTo({ top: window.scrollY + top });
  };

  return (
    <SavedBenefitsContext.Provider value={store}>
      <div className="wrap">
        <aside className="side">
          <form className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <RegionField tree={tree} pick={pick} choice={region} prepared={region.isPrepared(benefits)} onChange={setPick} />
            <ChildDatesField
              input={childInput}
              today={today}
              stageText={stage ? describeStage(stage) : '출산예정일을 넣으면 신청 일정을 날짜로 계산해 드려요'}
              onChange={setChildInput}
            />
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
          {fullTimeline && <CalendarDownload timeline={fullTimeline} />}
          <p className="notice">
            {dates?.isBorn
              ? '일정은 실제 출생일로 계산했어요.'
              : '일정은 아이가 출산예정일에 태어난다고 보고 계산해요. 태어나면 "아이가 태어났어요"에 출생일을 넣어 주세요.'}
          </p>
        </aside>

        <section className="list" aria-label="혜택" ref={listRef}>
          {tabs.length > 0 && <PhaseTabs tabs={tabs} active={active} onSelect={selectTab} />}
          {active === SAVED_TAB && <SavedList items={savedItems} />}
          {showsTimeline && (
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
    </SavedBenefitsContext.Provider>
  );
}
