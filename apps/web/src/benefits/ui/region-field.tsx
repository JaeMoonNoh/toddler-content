import type { RegionChoice, RegionTree } from '../domain/region';

export interface RegionPick {
  provinceCode: string; // ''이면 고르지 않음
  districtCode: string;
}

// 사는 곳: 시·도를 고르면 그 아래 시·군·구를 고른다
export function RegionField({ tree, pick, choice, prepared, onChange }: {
  tree: RegionTree;
  pick: RegionPick;
  choice: RegionChoice;
  prepared: boolean;
  onChange: (pick: RegionPick) => void;
}) {
  const districts = pick.provinceCode ? tree.districtsOf(pick.provinceCode) : [];
  return (
    <div className="field">
      <label htmlFor="province">사는 곳</label>
      <select id="province" value={pick.provinceCode} onChange={(e) => onChange({ provinceCode: e.target.value, districtCode: '' })}>
        <option value="">시·도 선택</option>
        {tree.provinces().map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>
      {districts.length > 0 && (
        <select aria-label="시·군·구" value={pick.districtCode} onChange={(e) => onChange({ ...pick, districtCode: e.target.value })}>
          <option value="">시·군·구 선택</option>
          {districts.map((region) => (
            <option key={region.code} value={region.code}>
              {region.name}
            </option>
          ))}
        </select>
      )}
      <p className="stage" aria-live="polite">
        {regionNote(pick, choice, prepared)}
      </p>
    </div>
  );
}

function regionNote(pick: RegionPick, choice: RegionChoice, prepared: boolean): string | null {
  if (!pick.provinceCode) return '사는 곳을 고르면 그 지역 혜택도 함께 보여드려요';
  if (!prepared) return `${choice.place.fullName} 혜택은 아직 정리 중이에요. 지금은 ${choice.upperLabels().join('·')} 혜택만 보여드려요`;
  return null;
}
