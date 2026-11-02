import { Module } from '@nestjs/common';
import { ApplySnapshotUseCase } from '../application/apply-snapshot.use-case';
import { SnapshotRepository } from '../application/ports';
import { PrismaSnapshotRepository } from './prisma-snapshot.repository';

// 비즈니스 로직(application)은 Nest를 모르므로, 여기서 포트에 구현을 연결해 조립한다
@Module({
  providers: [
    { provide: SnapshotRepository, useClass: PrismaSnapshotRepository },
    {
      provide: ApplySnapshotUseCase,
      useFactory: (repository: SnapshotRepository) => new ApplySnapshotUseCase(repository),
      inject: [SnapshotRepository],
    },
  ],
  exports: [ApplySnapshotUseCase],
})
export class CollectModule {}
