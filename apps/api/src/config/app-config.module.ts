import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env.validation';

// 서버와 CLI 모두 이 모듈로 환경 변수를 읽는다 (apps/api/.env를 읽고, Docker에서는 컨테이너 환경 변수)
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv })],
})
export class AppConfigModule {}
