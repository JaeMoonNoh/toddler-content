import { NestFactory } from '@nestjs/core';

import { formatKstDate } from '../../../shared/format-kst';
import { RegionService } from '../../application/region.service';

import { RegionCliModule } from './region-cli.module';
import { printRegionSync } from './region-sync-printer';

const USAGE = `사용법: pnpm region <명령>
  sync    행정안전부 법정동코드를 받아 data/regions.json을 새로 쓰기`;

async function main() {
  const [name] = process.argv.slice(2);
  if (name !== 'sync') {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const app = await NestFactory.createApplicationContext(RegionCliModule, { logger: ['error', 'warn'] });
  try {
    console.log(printRegionSync(await app.get(RegionService).sync(formatKstDate(new Date()))));
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
