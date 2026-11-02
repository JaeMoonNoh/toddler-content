'use client';

import { useMemo, useState } from 'react';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { describeStage, pregnancyStage } from '../domain/pregnancy';
import { groupForRegion, REGIONS } from '../domain/region';
import { BenefitCard } from './benefit-card';

// 사는 곳과 출산예정일은 이 화면(브라우저) 안에서만 쓰고 서버로 보내지 않는다
export function BenefitFinder({ benefits }: { benefits: PublishedBenefit[] }) {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [dueText, setDueText] = useState('');

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const groups = useMemo(() => groupForRegion(region, benefits), [region, benefits]);
  const total = groups.reduce((sum, group) => sum + group.benefits.length, 0);
  const due = CalendarDate.parse(dueText);
  const stage = due ? describeStage(pregnancyStage(due, CalendarDate.today())) : null;

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
              {stage ?? '출산예정일을 넣으면 임신 주차를 알려드려요'}
            </p>
          </div>
        </form>
        <p className="notice">
          신청 시작일·마감일을 날짜로 계산하는 타임라인은 준비 중이에요. 지금은 받을 수 있는 혜택 목록을 보여드려요.
        </p>
      </aside>

      <section className="list" aria-labelledby="list-title">
        <div className="listhead">
          <h2 id="list-title">받을 수 있는 혜택</h2>
          <p>{total}건</p>
        </div>
        {groups.length === 0 && <p className="empty">이 지역에 보여드릴 혜택이 아직 없어요.</p>}
        {groups.map((group) => (
          <section key={group.scope} className="group" aria-labelledby={`group-${group.scope}`}>
            <h3 id={`group-${group.scope}`} className="phase">
              {group.label} <span>{group.benefits.length}</span>
            </h3>
            <ul className="cards">
              {group.benefits.map((benefit) => (
                <BenefitCard key={benefit.slug} benefit={benefit} />
              ))}
            </ul>
          </section>
        ))}
      </section>
    </div>
  );
}
