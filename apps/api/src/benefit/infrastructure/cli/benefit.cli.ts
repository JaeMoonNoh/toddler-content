import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { formatKstDate } from '../../../shared/format-kst';
import { BenefitCandidateService } from '../../application/benefit-candidate.service';
import { BenefitCatalogService } from '../../application/benefit-catalog.service';
import { BenefitPlanService, type PlanProblem } from '../../application/benefit-plan.service';
import { BenefitReviewService } from '../../application/benefit-review.service';
import { parsePlans } from '../catalog/json-benefit-plans';
import { parseDecisions } from '../catalog/json-candidate-decisions';

import { BenefitCliModule } from './benefit-cli.module';
import { BenefitDetailPrinter } from './benefit-detail-printer';
import { printCandidates } from './candidate-printer';
import { printCardsToPlan } from './plan-text-printer';
import { ReviewPrinter } from './review-printer';

const USAGE = `사용법: pnpm benefit <명령>
  sync                     data/benefit-catalog.json을 DB에 반영
  review                   확인이 필요한 혜택 보기
  review <slug>            혜택 하나를 검증할 때 볼 내용 (정리한 일정·금액과 지금 원문)
  verify <slug> [...]      원문을 확인한 혜택에 확인일 남기기
  retire <slug> [...]      목록 파일에서 뺀 혜택을 DB에서도 지우기 (사이트에서 사라짐)
  candidates <지역코드>    그 지역과 아래 지역의 혜택 후보를 md로 (예: 인천 2800000000)
  add <지역코드> <판단.json>
                           후보 md에서 고른 것을 혜택 목록에 카드로 넣기 (이름 정리, 신청 방법 초안 포함)
  plan-texts <지역코드> <폴더> [건수]
                           일정·금액·올해 기간이 비어 있는 카드의 원문을 md로 나눠 쓰기 (기본 50건씩)
  plan-check <초안.json>   일정·금액 초안 검사 (규칙: docs/benefit-plan-rules.md)
  plan-apply <초안.json>   검사를 통과한 초안을 data/benefit-catalog.json에 넣기`;

const DEFAULT_PLAN_TEXT_SIZE = 50;

type Command = (app: INestApplicationContext, args: string[]) => Promise<{ text: string; ok: boolean }>;

const COMMANDS: Record<string, Command> = {
  sync: async (app) => ({ text: app.get(ReviewPrinter).printSync(await app.get(BenefitCatalogService).sync()), ok: true }),
  review: async (app, [slug]) => {
    if (!slug) return { text: app.get(ReviewPrinter).printQueue(await app.get(BenefitReviewService).queue()), ok: true };
    const detail = await app.get(BenefitReviewService).detail(slug);
    return detail ? { text: app.get(BenefitDetailPrinter).print(detail), ok: true } : { text: `✘ ${slug}: 없는 혜택입니다`, ok: false };
  },
  verify: async (app, slugs) => {
    const at = new Date();
    const result = await app.get(BenefitReviewService).verify(slugs, at);
    return { text: app.get(ReviewPrinter).printVerify(result, at), ok: result.failed.length === 0 && slugs.length > 0 };
  },
  candidates: async (app, [regionCode]) => {
    if (!regionCode) return { text: '지역코드를 넣어 주세요 (data/regions.json의 code, 예: 2800000000)', ok: false };
    const list = await app.get(BenefitCandidateService).candidatesFor(regionCode);
    return { text: printCandidates(list, formatKstDate(new Date())), ok: true };
  },
  add: async (app, [regionCode, path]) => {
    if (!regionCode || !path) return { text: '지역코드와 판단 파일을 넣어 주세요 (예: add 4300000000 decisions.json)', ok: false };
    const cards = await app.get(BenefitCandidateService).add(regionCode, parseDecisions(await readFile(path, 'utf8')));
    const withoutHowTo = cards.filter((card) => !card.howToApply).length;
    return {
      text: `✔ ${cards.length}건을 혜택 목록에 넣었어요 (신청 방법 초안 없음 ${withoutHowTo}건). 다음은 plan-texts로 일정·금액`,
      ok: true,
    };
  },
  'plan-texts': async (app, [regionCode, outDir, sizeArg]) => {
    if (!regionCode || !outDir) return { text: '지역코드와 출력 폴더를 넣어 주세요 (예: plan-texts 4100000000 out)', ok: false };
    const size = Number(sizeArg ?? DEFAULT_PLAN_TEXT_SIZE);
    if (!Number.isInteger(size) || size < 1) return { text: `파일당 건수는 1 이상의 정수여야 해요: ${sizeArg}`, ok: false };
    const cards = await app.get(BenefitPlanService).cardsToPlan(regionCode);
    const total = Math.ceil(cards.length / size);
    await mkdir(outDir, { recursive: true });
    for (let part = 0; part < total; part++) {
      const title = `${regionCode} 카드 원문 ${part + 1}/${total}`;
      await writeFile(join(outDir, `texts-${part + 1}.md`), printCardsToPlan(cards.slice(part * size, (part + 1) * size), title));
    }
    return { text: `카드 ${cards.length}건을 ${outDir}에 ${total}개 파일로 썼어요`, ok: true };
  },
  'plan-check': async (app, [path]) => {
    if (!path) return { text: '초안 파일을 넣어 주세요', ok: false };
    const plans = parsePlans(await readFile(path, 'utf8'));
    const problems = await app.get(BenefitPlanService).check(plans, thisYear());
    return problems.length ? { text: printPlanProblems(problems), ok: false } : { text: `✔ 문제 없음 (${plans.length}건)`, ok: true };
  },
  'plan-apply': async (app, [path]) => {
    if (!path) return { text: '초안 파일을 넣어 주세요', ok: false };
    const applied = await app.get(BenefitPlanService).apply(parsePlans(await readFile(path, 'utf8')), formatKstDate(new Date()));
    return { text: `✔ ${applied.length}건을 혜택 목록에 넣었어요. 확인 뒤 pnpm benefit sync`, ok: true };
  },
  retire: async (app, slugs) => {
    const result = await app.get(BenefitCatalogService).retire(slugs);
    return { text: app.get(ReviewPrinter).printRetire(result), ok: result.failed.length === 0 && slugs.length > 0 };
  },
};

function thisYear() {
  return formatKstDate(new Date()).slice(0, 4);
}

function printPlanProblems(problems: PlanProblem[]) {
  return [`✘ 문제 ${problems.length}건`, ...problems.map(({ slug, problem }) => `- ${slug}: ${problem}`)].join('\n');
}

async function main() {
  const [name, ...args] = process.argv.slice(2);
  const command = COMMANDS[name ?? ''];
  if (!command) {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const app = await NestFactory.createApplicationContext(BenefitCliModule, { logger: ['error', 'warn'] });
  try {
    const { text, ok } = await command(app, args);
    console.log(text);
    process.exitCode = ok ? 0 : 1;
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
