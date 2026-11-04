import { Injectable } from '@nestjs/common';

import { CollectService } from '../../collect/application/collect.service';
import { RegionService } from '../../region/application/region.service';
import { Benefit, type BenefitDetails } from '../domain/benefit';
import { type CandidateStrength, candidateStrengthOf, serviceNameKey } from '../domain/benefit-candidate';
import { toCardName } from '../domain/card-name';
import { draftHowToApply } from '../domain/how-to-apply-draft';
import { SourceRef } from '../domain/source-ref';

import { CatalogError } from './benefit-catalog.service';
import { BenefitCatalog } from './ports/benefit-catalog';
import { SourceStateReader } from './ports/source-state.reader';

import type { SourceRecord } from '../../collect/domain/source-record';
import type { Audience } from '../domain/audience';
import type { EligibilityCondition } from '../domain/eligibility-condition';

export interface BenefitCandidate {
  regionCode: string;
  name: string;
  summary: string;
  agency: string;
  url: string;
  strength: CandidateStrength;
  sources: SourceRef[]; // 보조금24가 있으면 앞에
  suggestedSlug: string;
}

export interface CandidateList {
  regions: { code: string; fullName: string }[]; // 고른 지역과 그 아래 지역 (보여줄 순서)
  candidates: BenefitCandidate[];
}

// 지자체 혜택만 고른다. 중앙부처·공공기관 혜택은 전국 혜택이라 지역 후보가 아니다
const LOCAL_AGENCY_TYPES = ['광역시도', '시군구'];

// 후보 md를 보고 넣기로 정한 것. slug는 후보 md의 slug 칸
export interface CandidateDecision {
  slug: string;
  merge?: string[]; // 같은 혜택이라 이 카드의 두 번째 원본으로 합칠 후보의 slug
  name?: string; // 지역 머리말을 뗀 이름이 어색할 때만
  audience?: Audience;
  conditions?: EligibilityCondition[];
}

type FindRegion = (fullName: string) => { code: string } | null;

// 지역을 넓힐 때 쓰는 후보 목록: 그 지역과 아래 지역의 지자체 혜택 중 아직 혜택 목록에 없는 것
@Injectable()
export class BenefitCandidateService {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly collect: CollectService,
    private readonly regions: RegionService,
    private readonly sources: SourceStateReader,
  ) {}

  async candidatesFor(regionCode: string): Promise<CandidateList> {
    const tree = await this.regions.tree();
    const area = tree.selfAndDescendantsOf(regionCode);
    const order = new Map(area.map((region, index) => [region.code, index]));
    const known = new Set((await this.catalog.load()).flatMap((entry) => entry.sources.map((ref) => ref.key)));
    const findRegion: FindRegion = (fullName) => tree.findByFullName(fullName);

    const found = [
      ...(await this.collect.currentItems('GOV24')).map((item) => fromGov24(item, findRegion)),
      ...(await this.collect.currentItems('BOKJIRO_LOCAL')).map((item) => fromBokjiroLocal(item, findRegion)),
    ].filter(
      (candidate): candidate is BenefitCandidate =>
        candidate !== null && order.has(candidate.regionCode) && !known.has(candidate.sources[0].key),
    );

    return {
      regions: area.map(({ code, fullName }) => ({ code, fullName })),
      candidates: mergeSameService(found).sort(
        (a, b) =>
          order.get(a.regionCode)! - order.get(b.regionCode)! ||
          rankOf(a.strength) - rankOf(b.strength) ||
          a.name.localeCompare(b.name, 'ko'),
      ),
    };
  }

  // 고른 후보를 혜택 목록 끝에 카드로 넣는다. 일정·금액은 비워 두고 plan 명령으로 채운다.
  // 판단에 문제가 하나라도 있으면 아무것도 넣지 않는다
  async add(regionCode: string, decisions: CandidateDecision[]): Promise<BenefitDetails[]> {
    const bySlug = new Map((await this.candidatesFor(regionCode)).candidates.map((c) => [c.suggestedSlug, c]));
    rejectInvalidDecisions(decisions, bySlug);

    const picked = decisions.map((decision) => ({
      decision,
      candidates: [decision.slug, ...(decision.merge ?? [])].map((slug) => bySlug.get(slug)!),
    }));
    const current = await this.sources.read(picked.flatMap(({ candidates }) => candidates.flatMap((c) => c.sources)));
    const problems: string[] = [];
    const cards = picked.map(({ decision, candidates: [main, ...merged] }) => {
      const sources = [...main.sources, ...merged.flatMap((c) => c.sources)];
      const drafts = sources.flatMap((ref) => {
        const state = current.of(ref);
        return state ? [{ ref, payload: state.payload }] : [];
      });
      const card: BenefitDetails = {
        slug: decision.slug,
        name: decision.name ?? toCardName(main.name),
        regionCode: main.regionCode,
        sourceUrl: main.url,
        sources,
        schedule: null,
        conditions: decision.conditions ?? [],
        amount: null,
        applicationPeriod: null,
        howToApply: draftHowToApply(drafts, main.url, main.regionCode),
        audience: decision.audience ?? null,
      };
      try {
        Benefit.register(card);
      } catch (error) {
        problems.push(error instanceof Error ? error.message : String(error));
      }
      return card;
    });
    if (problems.length) throw new CatalogError(`판단에 문제가 있어 넣지 않았습니다\n- ${problems.join('\n- ')}`);

    await this.catalog.add(cards);
    return cards;
  }
}

function rejectInvalidDecisions(decisions: CandidateDecision[], candidates: Map<string, BenefitCandidate>) {
  const used = decisions.flatMap((decision) => [decision.slug, ...(decision.merge ?? [])]);
  const problems = [
    ...used.filter((slug) => !candidates.has(slug)).map((slug) => `${slug}: 이 지역 후보에 없습니다 (이미 혜택 목록에 있거나 slug가 틀림)`),
    ...[...new Set(used.filter((slug, index) => used.indexOf(slug) !== index))].map((slug) => `${slug}: 판단에 두 번 이상 나옵니다`),
  ];
  if (problems.length) throw new CatalogError(`판단에 문제가 있어 넣지 않았습니다\n- ${problems.join('\n- ')}`);
}

function fromGov24({ externalId, payload }: SourceRecord, findRegion: FindRegion): BenefitCandidate | null {
  if (!LOCAL_AGENCY_TYPES.includes(textOf(payload, '소관기관유형'))) return null;
  const agency = textOf(payload, '소관기관명');
  const region = findRegion(agency);
  const name = textOf(payload, '서비스명');
  const summary = textOf(payload, '서비스목적요약');
  const strength = candidateStrengthOf({ name, detail: `${textOf(payload, '지원대상')} ${summary}`, lifeStages: '' });
  if (!region || !strength) return null;
  return {
    regionCode: region.code,
    name,
    summary,
    agency,
    url: textOf(payload, '상세조회URL'),
    strength,
    sources: [new SourceRef('GOV24', externalId)],
    suggestedSlug: `gov24-${externalId.toLowerCase()}`,
  };
}

function fromBokjiroLocal({ externalId, payload }: SourceRecord, findRegion: FindRegion): BenefitCandidate | null {
  const region = findRegion(`${textOf(payload, 'ctpvNm')} ${textOf(payload, 'sggNm')}`);
  const name = textOf(payload, 'servNm');
  const summary = textOf(payload, 'servDgst');
  const strength = candidateStrengthOf({ name, detail: summary, lifeStages: textOf(payload, 'lifeNmArray') });
  if (!region || !strength) return null;
  return {
    regionCode: region.code,
    name,
    summary,
    // 담당 부서 이름에 이미 시·도, 시·군·구가 들어 있다 (예: 인천광역시 여성가족국 영유아정책과)
    agency: textOf(payload, 'bizChrDeptNm') || `${textOf(payload, 'ctpvNm')} ${textOf(payload, 'sggNm')}`.trim(),
    url: textOf(payload, 'servDtlLink'),
    strength,
    sources: [new SourceRef('BOKJIRO_LOCAL', externalId)],
    suggestedSlug: `bokjiro-${externalId.toLowerCase()}`,
  };
}

// 같은 지역에 같은 이름으로 두 출처에 올라온 혜택은 한 줄로 합친다 (보조금24를 대표로)
function mergeSameService(candidates: BenefitCandidate[]): BenefitCandidate[] {
  const merged = new Map<string, BenefitCandidate>();
  for (const candidate of candidates) {
    const key = `${candidate.regionCode}:${serviceNameKey(candidate.name)}`;
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, candidate);
      continue;
    }
    existing.sources.push(...candidate.sources);
    if (rankOf(candidate.strength) < rankOf(existing.strength)) existing.strength = candidate.strength;
  }
  return [...merged.values()];
}

function rankOf(strength: CandidateStrength) {
  return strength === 'strong' ? 0 : 1;
}

function textOf(payload: Record<string, unknown>, field: string): string {
  const value = payload[field];
  return typeof value === 'string' ? value.trim() : '';
}
