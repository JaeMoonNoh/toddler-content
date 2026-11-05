export type Insurance = 'insured' | 'uninsured' | 'unknown';
export type Childcare = 'daycare' | 'home' | 'unknown';

export interface HouseholdConditions {
  birthParent: Insurance; // 출산하는 분 고용보험
  partner: Insurance; // 배우자 고용보험
  childcare: Childcare; // 어린이집·유치원 보낼 예정인지
}

export interface ChildConditions {
  dueDate: null | string; // YYYY-MM-DD
  birthDate: null | string; // 태어났으면 실제 출생일
  nickname: string; // 태명
  name: string;
  birthOrder: null | number; // 몇째인지. 3은 셋째 이상
}

export class InvalidConditionsError extends Error {}

export const MAX_CHILDREN = 5;
export const NAME_MAX_LENGTH = 10;
const INSURANCE: Insurance[] = ['insured', 'uninsured', 'unknown'];
const CHILDCARE: Childcare[] = ['daycare', 'home', 'unknown'];
const BIRTH_ORDERS = [1, 2, 3];
const REGION_CODE = /^\d{10}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// 로그인한 사람이 저장한 조건. 아는 칸만 골라 담아서, 화면이 보낸 다른 값은 저장하지 않는다
export class SavedConditions {
  private constructor(
    readonly regionCode: null | string, // 법정동코드 10자리. 시·군·구까지 골랐으면 시·군·구 코드
    readonly household: HouseholdConditions,
    readonly children: ChildConditions[],
  ) {}

  static parse(value: unknown): SavedConditions {
    const problems: string[] = [];
    const input = recordOf(value);
    const household = recordOf(input.household);
    const children = Array.isArray(input.children) ? input.children : [];

    const regionCode = nullableMatch(input.regionCode, REGION_CODE, 'regionCode', problems);
    const parsedHousehold: HouseholdConditions = {
      birthParent: oneOf(household.birthParent, INSURANCE, 'household.birthParent', problems),
      partner: oneOf(household.partner, INSURANCE, 'household.partner', problems),
      childcare: oneOf(household.childcare, CHILDCARE, 'household.childcare', problems),
    };
    if (!Array.isArray(input.children)) problems.push('children: 목록이어야 합니다');
    if (children.length > MAX_CHILDREN) problems.push(`children: 아이는 ${MAX_CHILDREN}명까지 저장할 수 있습니다`);
    const parsedChildren = children.slice(0, MAX_CHILDREN).map((child, index) => childOf(child, `children[${index}]`, problems));

    if (problems.length > 0) throw new InvalidConditionsError(`저장할 조건이 올바르지 않습니다: ${problems.join(', ')}`);
    return new SavedConditions(regionCode, parsedHousehold, parsedChildren);
  }

  toJSON() {
    return { regionCode: this.regionCode, household: this.household, children: this.children };
  }
}

function childOf(value: unknown, path: string, problems: string[]): ChildConditions {
  const child = recordOf(value);
  const dueDate = nullableDate(child.dueDate, `${path}.dueDate`, problems);
  const birthDate = nullableDate(child.birthDate, `${path}.birthDate`, problems);
  const birthOrder =
    child.birthOrder === null || child.birthOrder === undefined
      ? null
      : oneOf(child.birthOrder, BIRTH_ORDERS, `${path}.birthOrder`, problems);
  return {
    dueDate,
    birthDate,
    nickname: shortText(child.nickname, `${path}.nickname`, problems),
    name: shortText(child.name, `${path}.name`, problems),
    birthOrder,
  };
}

function recordOf(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function oneOf<T>(value: unknown, allowed: T[], path: string, problems: string[]): T {
  if (allowed.includes(value as T)) return value as T;
  problems.push(`${path}: ${allowed.join('|')} 중 하나여야 합니다`);
  return allowed[allowed.length - 1];
}

function nullableMatch(value: unknown, pattern: RegExp, path: string, problems: string[]): null | string {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && pattern.test(value)) return value;
  problems.push(`${path}: 형식이 올바르지 않습니다`);
  return null;
}

function nullableDate(value: unknown, path: string, problems: string[]): null | string {
  const date = nullableMatch(value, ISO_DATE, path, problems);
  if (date && !isRealDate(date)) {
    problems.push(`${path}: 없는 날짜입니다`);
    return null;
  }
  return date;
}

function isRealDate(text: string): boolean {
  const date = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text);
}

function shortText(value: unknown, path: string, problems: string[]): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') {
    problems.push(`${path}: 글자여야 합니다`);
    return '';
  }
  const text = value.trim();
  if ([...text].length > NAME_MAX_LENGTH) problems.push(`${path}: ${NAME_MAX_LENGTH}자까지 넣을 수 있습니다`);
  return text;
}
