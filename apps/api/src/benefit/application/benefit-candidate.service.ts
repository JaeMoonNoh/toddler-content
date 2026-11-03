import { Injectable } from '@nestjs/common';

import { CollectService } from '../../collect/application/collect.service';
import { RegionService } from '../../region/application/region.service';
import { type CandidateStrength, candidateStrengthOf, serviceNameKey } from '../domain/benefit-candidate';
import { SourceRef } from '../domain/source-ref';

import { BenefitCatalog } from './ports/benefit-catalog';

import type { SourceRecord } from '../../collect/domain/source-record';

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

type FindRegion = (fullName: string) => { code: string } | null;

// 지역을 넓힐 때 쓰는 후보 목록: 그 지역과 아래 지역의 지자체 혜택 중 아직 혜택 목록에 없는 것
@Injectable()
export class BenefitCandidateService {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly collect: CollectService,
    private readonly regions: RegionService,
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
