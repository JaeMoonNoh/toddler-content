import { Controller, Get } from '@nestjs/common';

// 서버가 떠 있는지 확인하는 용도. DB 연결 확인은 DB 연동 PR에서 추가한다.
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
