import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { CollectAllSourcesUseCase } from '../../application/collect-all-sources.use-case';
import { CollectCliModule } from './collect-cli.module';
import { ReportPrinter } from './report-printer';

// 지금 바로 전체 수집: pnpm --filter @toddler/api collect
async function main() {
  const app = await NestFactory.createApplicationContext(CollectCliModule, { logger: ['error', 'warn'] });
  try {
    const report = await app.get(CollectAllSourcesUseCase).execute();
    console.log(app.get(ReportPrinter).print(report, new Date()));
    process.exitCode = report.hasFailures ? 1 : 0;
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
