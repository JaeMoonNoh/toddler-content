export interface FinishedRequest {
  method: string;
  url: string;
  status: number;
  durationMs: number;
}

export interface RequestLogLine {
  level: 'log' | 'warn' | 'error';
  message: string;
}

// 헬스 체크는 자주 불려서 남기면 다른 요청이 묻힌다
const SKIPPED_PATHS = ['/health'];

// 끝난 요청을 한 줄로 바꾼다. 남기지 않을 요청이면 null
export function toRequestLogLine({ method, url, status, durationMs }: FinishedRequest): RequestLogLine | null {
  const path = pathOf(url);
  if (SKIPPED_PATHS.includes(path)) return null;
  return { level: levelOf(status), message: `${method} ${path} ${status} ${Math.round(durationMs)}ms` };
}

// 쿼리에는 출산예정일 같은 개인 정보가 들어갈 수 있어서 경로만 남긴다
function pathOf(url: string) {
  return url.split('?')[0] || '/';
}

function levelOf(status: number): RequestLogLine['level'] {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'log';
}
