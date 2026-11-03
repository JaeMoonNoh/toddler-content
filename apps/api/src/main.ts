import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // docker stop의 SIGTERM을 받으면 진행 중인 수집을 마치고 DB 연결을 닫은 뒤 종료한다
  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  app.enableCors({ origin: config.getOrThrow<string>('WEB_ORIGIN') });
  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap();
