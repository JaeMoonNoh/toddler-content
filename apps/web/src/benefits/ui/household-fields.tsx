import type { Childcare, Household, Insurance } from '../domain/eligibility';

const OPTIONS: { value: Insurance; label: string }[] = [
  { value: 'unknown', label: '선택 안 함' },
  { value: 'insured', label: '가입했어요 (직장인 등)' },
  { value: 'uninsured', label: '가입 안 했어요' },
];

const PEOPLE: { key: 'birthParent' | 'partner'; label: string }[] = [
  { key: 'birthParent', label: '출산하는 분' },
  { key: 'partner', label: '배우자' },
];

const BIRTH_ORDERS: { value: string; label: string }[] = [
  { value: '', label: '선택 안 함' },
  { value: '1', label: '첫째' },
  { value: '2', label: '둘째' },
  { value: '3', label: '셋째 이상' },
];

export function BirthOrderField({ household, onChange }: { household: Household; onChange: (next: Household) => void }) {
  return (
    <div className="field">
      <label htmlFor="birth-order">이번 아이는 (선택)</label>
      <select
        id="birth-order"
        value={household.birthOrder === null ? '' : String(household.birthOrder)}
        onChange={(e) => onChange({ ...household, birthOrder: e.target.value ? Number(e.target.value) : null })}
      >
        {BIRTH_ORDERS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const CHILDCARE: { value: Childcare; label: string }[] = [
  { value: 'unknown', label: '선택 안 함' },
  { value: 'home', label: '집에서 돌볼 예정이에요' },
  { value: 'daycare', label: '보낼 예정이에요' },
];

export function ChildcareField({ household, onChange }: { household: Household; onChange: (next: Household) => void }) {
  return (
    <div className="field">
      <label htmlFor="childcare">어린이집·유치원 (선택)</label>
      <select id="childcare" value={household.childcare} onChange={(e) => onChange({ ...household, childcare: e.target.value as Childcare })}>
        {CHILDCARE.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="stage">가정양육수당과 보육료 지원은 함께 받을 수 없어서, 답하면 맞는 쪽만 보여드려요.</p>
    </div>
  );
}

export function HouseholdFields({ household, onChange }: { household: Household; onChange: (next: Household) => void }) {
  return (
    <fieldset className="field household">
      <legend>고용보험 (선택)</legend>
      {PEOPLE.map(({ key, label }) => (
        <div key={key} className="pair">
          <label htmlFor={`insurance-${key}`}>{label}</label>
          <select
            id={`insurance-${key}`}
            value={household[key]}
            onChange={(e) => onChange({ ...household, [key]: e.target.value as Insurance })}
          >
            {OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <p className="stage">답하면 받을 수 없는 휴가·급여를 빼고 보여드려요. 답하지 않으면 모두 보여요.</p>
    </fieldset>
  );
}
