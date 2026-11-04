import type { TimelineTab } from '../domain/timeline';

// 스크롤해도 목록 위에 붙어 있어서 언제든 다른 시기로 넘어갈 수 있다
export function PhaseTabs({ tabs, active, onSelect }: { tabs: TimelineTab[]; active: string; onSelect: (label: string) => void }) {
  return (
    <div className="tabs" role="tablist" aria-label="시기">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          role="tab"
          aria-selected={tab.label === active}
          className={tab.label === active ? 'tab on' : 'tab'}
          onClick={() => onSelect(tab.label)}
        >
          {tab.label} <span>{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
