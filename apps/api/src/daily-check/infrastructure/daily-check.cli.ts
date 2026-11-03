import { NestFactory } from '@nestjs/core';

import { DailyCheckService } from '../application/daily-check.service';

import { DailyCheckCliModule } from './daily-check-cli.module';
import { DailyCheckPrinter } from './daily-check-printer';

// 새벽 4시에 하는 일을 지금 바로: pnpm collect
async function main() {
  const app = await NestFactory.createApplicationContext(DailyCheckCliModule, { logger: ['error', 'warn'] });
  try {
    const result = await app.get(DailyCheckService).run();
    console.log(app.get(DailyCheckPrinter).print(result, new Date()));
    process.exitCode = result.collection.hasFailures ? 1 : 0;
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
