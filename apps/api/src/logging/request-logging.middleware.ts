import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { toRequestLogLine } from './request-log';

import type { IncomingMessage, ServerResponse } from 'node:http';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: IncomingMessage & { originalUrl?: string }, response: ServerResponse, next: () => void) {
    const startedAt = performance.now();
    response.on('finish', () => {
      const line = toRequestLogLine({
        method: request.method ?? '-',
        url: request.originalUrl ?? request.url ?? '/',
        status: response.statusCode,
        durationMs: performance.now() - startedAt,
      });
      if (line) this.logger[line.level](line.message);
    });
    next();
  }
}
