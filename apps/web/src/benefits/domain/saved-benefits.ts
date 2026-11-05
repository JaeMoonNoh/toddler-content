import type { PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import type { Timeline, TimelineItem } from './timeline';

export type SavedState = 'todo' | 'applied';

export interface SavedItem {
  benefit: PublishedBenefit;
  state: SavedState;
  scheduled: TimelineItem | null; // 출생일·출산예정일로 신청 기간을 계산한 혜택이면 그 일정
  deadline: CalendarDate | null;
}

const FORMAT_VERSION = 1;

// 챙기려고 저장한 혜택과 신청을 마쳤는지. 바꾸면 새 목록을 돌려준다
export class SavedBenefits {
  private constructor(private readonly states: ReadonlyMap<string, SavedState>) {}

  static empty(): SavedBenefits {
    return new SavedBenefits(new Map());
  }

  // 저장해 둔 값이 깨졌거나 모양이 다르면 버리고 빈 목록으로 시작한다
  static fromJSON(value: unknown): SavedBenefits {
    if (!isRecord(value) || value.version !== FORMAT_VERSION || !Array.isArray(value.items)) return SavedBenefits.empty();
    return new SavedBenefits(new Map(value.items.filter(isEntry).map(({ slug, state }) => [slug, state])));
  }

  static fromItems(items: { slug: string; state: SavedState }[]): SavedBenefits {
    return SavedBenefits.fromJSON({ version: FORMAT_VERSION, items });
  }

  get items(): { slug: string; state: SavedState }[] {
    return [...this.states].map(([slug, state]) => ({ slug, state }));
  }

  toJSON() {
    return { version: FORMAT_VERSION, items: this.items };
  }

  stateOf(slug: string): SavedState | null {
    return this.states.get(slug) ?? null;
  }

  has(slug: string): boolean {
    return this.states.has(slug);
  }

  save(slug: string): SavedBenefits {
    return this.with(slug, 'todo');
  }

  markApplied(slug: string): SavedBenefits {
    return this.with(slug, 'applied');
  }

  // null이면 뺀다
  withState(slug: string, state: SavedState | null): SavedBenefits {
    return state === null ? this.remove(slug) : this.with(slug, state);
  }

  remove(slug: string): SavedBenefits {
    const states = new Map(this.states);
    states.delete(slug);
    return new SavedBenefits(states);
  }

  // 먼저 챙길 것부터: 마감이 남은 것(가까운 순), 마감을 모르는 것, 마감이 지난 것, 신청을 마친 것
  listOf(benefits: PublishedBenefit[], timeline: Timeline | null, today: CalendarDate): SavedItem[] {
    const scheduled = new Map(timeline?.phases.flatMap((phase) => phase.items).map((item) => [item.benefit.slug, item]));
    return benefits
      .flatMap((benefit) => {
        const state = this.stateOf(benefit.slug);
        if (!state) return [];
        const item = scheduled.get(benefit.slug) ?? null;
        return { benefit, state, scheduled: item, deadline: deadlineOf(benefit, item) };
      })
      .sort(
        (a, b) =>
          rankOf(a, today) - rankOf(b, today) ||
          (a.deadline && b.deadline ? a.deadline.daysSince(b.deadline) : 0) ||
          a.benefit.name.localeCompare(b.benefit.name, 'ko'),
      );
  }

  private with(slug: string, state: SavedState): SavedBenefits {
    return new SavedBenefits(new Map(this.states).set(slug, state));
  }
}

function deadlineOf(benefit: PublishedBenefit, scheduled: TimelineItem | null): CalendarDate | null {
  if (scheduled) return scheduled.window.end;
  return benefit.applicationPeriod ? CalendarDate.parse(benefit.applicationPeriod.end) : null;
}

function rankOf({ state, deadline }: SavedItem, today: CalendarDate): number {
  if (state === 'applied') return 3;
  if (!deadline) return 1;
  return today.isAfter(deadline) ? 2 : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isEntry(value: unknown): value is { slug: string; state: SavedState } {
  return isRecord(value) && typeof value.slug === 'string' && (value.state === 'todo' || value.state === 'applied');
}
