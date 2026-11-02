import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { INestApplicationContext } from '@nestjs/common';
import { RetireBenefitsUseCase } from '../../application/retire-benefits.use-case';
import { ReviewQueueUseCase } from '../../application/review-queue.use-case';
import { SyncCatalogUseCase } from '../../application/sync-catalog.use-case';
import { VerifyBenefitsUseCase } from '../../application/verify-benefits.use-case';
import { BenefitCliModule } from './benefit-cli.module';
import { ReviewPrinter } from './review-printer';

const USAGE = `사용법: pnpm benefit <명령>
  sync                     data/benefit-catalog.json을 DB에 반영
  review                   확인이 필요한 혜택 보기
  verify <slug> [...]      원문을 확인한 혜택에 확인일 남기기
  retire <slug> [...]      목록 파일에서 뺀 혜택을 DB에서도 지우기 (사이트에서 사라짐)`;

type Command = (app: INestApplicationContext, args: string[]) => Promise<{ text: string; ok: boolean }>;

const COMMANDS: Record<string, Command> = {
  sync: async (app) => ({ text: app.get(ReviewPrinter).printSync(await app.get(SyncCatalogUseCase).execute()), ok: true }),
  review: async (app) => ({ text: app.get(ReviewPrinter).printQueue(await app.get(ReviewQueueUseCase).execute()), ok: true }),
  verify: async (app, slugs) => {
    const at = new Date();
    const result = await app.get(VerifyBenefitsUseCase).execute(slugs, at);
    return { text: app.get(ReviewPrinter).printVerify(result, at), ok: result.failed.length === 0 && slugs.length > 0 };
  },
  retire: async (app, slugs) => {
    const result = await app.get(RetireBenefitsUseCase).execute(slugs);
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
