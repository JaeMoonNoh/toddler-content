import { NestFactory } from '@nestjs/core';
import type { INestApplicationContext } from '@nestjs/common';
import { BenefitCatalogService } from '../../application/benefit-catalog.service';
import { BenefitReviewService } from '../../application/benefit-review.service';
import { BenefitCliModule } from './benefit-cli.module';
import { BenefitDetailPrinter } from './benefit-detail-printer';
import { ReviewPrinter } from './review-printer';

const USAGE = `사용법: pnpm benefit <명령>
  sync                     data/benefit-catalog.json을 DB에 반영
  review                   확인이 필요한 혜택 보기
  review <slug>            혜택 하나를 검증할 때 볼 내용 (정리한 일정·금액과 지금 원문)
  verify <slug> [...]      원문을 확인한 혜택에 확인일 남기기
  retire <slug> [...]      목록 파일에서 뺀 혜택을 DB에서도 지우기 (사이트에서 사라짐)`;

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
  retire: async (app, slugs) => {
    const result = await app.get(BenefitCatalogService).retire(slugs);
    return { text: app.get(ReviewPrinter).printRetire(result), ok: result.failed.length === 0 && slugs.length > 0 };
  },
};

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
