import type { Childcare, Household, Insurance } from '../../benefits/domain/eligibility';
import { NATIONWIDE_CODE, type RegionTree } from '../../benefits/domain/region';
import type { ChildDatesInput } from '../../benefits/ui/child-dates-field';
import type { RegionPick } from '../../benefits/ui/region-field';

// 서버에 저장하는 조건 (API의 SavedConditions와 같은 모양). 아이는 목록이지만 지금 화면은 한 명만 다룬다
export interface SavedConditions {
  regionCode: string | null;
  household: { birthParent: Insurance; partner: Insurance; childcare: Childcare };
  children: SavedChild[];
}

export interface SavedChild {
  dueDate: string | null;
  birthDate: string | null;
  nickname: string;
  name: string;
  birthOrder: number | null;
}

// 화면에 입력한 것
export interface FinderInput {
  pick: RegionPick;
  child: ChildDatesInput;
  household: Household;
}

export function toSavedConditions({ pick, child, household }: FinderInput): SavedConditions {
  return {
    regionCode: pick.districtCode || pick.provinceCode || null,
    household: { birthParent: household.birthParent, partner: household.partner, childcare: household.childcare },
    children: [
      {
        dueDate: child.dueText || null,
        birthDate: child.born && child.birthText ? child.birthText : null,
        nickname: child.nickname.trim(),
        name: child.name.trim(),
        birthOrder: household.birthOrder,
      },
    ],
  };
}

// 지역 코드가 지금 목록에 없으면(행정구역이 바뀌었으면) 사는 곳은 비워 둔다
export function toFinderInput(saved: SavedConditions, tree: RegionTree): FinderInput {
  const [province, district] = tree
    .choose(saved.regionCode)
    .lineage.filter((region) => region.code !== NATIONWIDE_CODE)
    .reverse();
  const child = saved.children[0];
  return {
    pick: { provinceCode: province?.code ?? '', districtCode: district?.code ?? '' },
    child: {
      dueText: child?.dueDate ?? '',
      nickname: child?.nickname ?? '',
      born: Boolean(child?.birthDate),
      birthText: child?.birthDate ?? '',
      name: child?.name ?? '',
    },
    household: { ...saved.household, birthOrder: child?.birthOrder ?? null },
  };
}

export function isSameConditions(a: SavedConditions, b: SavedConditions): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
