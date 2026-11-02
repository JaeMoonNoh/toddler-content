import { Module } from '@nestjs/common';
import { CollectSourceUseCase } from '../application/collect-source.use-case';
import { SnapshotRepository } from '../application/ports/snapshot.repository';
import { PrismaSnapshotRepository } from './persistence/prisma-snapshot.repository';

// application 층은 Nest를 모르므로 여기서 포트에 구현을 연결한다
@Module({
  providers: [
    { provide: SnapshotRepository, useClass: PrismaSnapshotRepository },
    {
      provide: CollectSourceUseCase,
      useFactory: (repository: SnapshotRepository) => new CollectSourceUseCase(repository),
      inject: [SnapshotRepository],
    },
  ],
  exports: [CollectSourceUseCase],
})
export class CollectModule {}
