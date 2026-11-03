export type Fetch = (url: string, init?: { signal?: AbortSignal }) => Promise<Response>;

export interface RetryNotice {
  attempt: number; // 몇 번째 재시도인지 (1부터)
  retries: number;
  delayMs: number;
  reason: string; // 인증키를 가린 주소가 들어간 오류 메시지
}

export interface HttpClientOptions {
  timeoutMs: number;
  retries: number;
  retryDelayMs: number;
  sleep: (ms: number) => Promise<void>;
  onRetry: (notice: RetryNotice) => void;
}

const DEFAULTS: HttpClientOptions = {
  timeoutMs: 30_000,
  retries: 2,
  retryDelayMs: 1_000,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  onRetry: () => {},
};

const SECRET_PARAMS = ['serviceKey'];

export function redactUrl(url: URL): string {
  const copy = new URL(url);
  for (const name of SECRET_PARAMS) if (copy.searchParams.has(name)) copy.searchParams.set(name, '***');
  return copy.toString();
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    url: URL,
    body: string,
  ) {
    super(`HTTP ${status} ${redactUrl(url)} ${body.replace(/\s+/g, ' ').slice(0, 200)}`.trim());
  }

  get retryable() {
    return this.status >= 500 || this.status === 429;
  }
}

export class HttpClient {
  private readonly options: HttpClientOptions;

  constructor(
    private readonly send: Fetch = fetch,
    options: Partial<HttpClientOptions> = {},
  ) {
    this.options = { ...DEFAULTS, ...options };
  }

  async getText(url: URL): Promise<string> {
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.requestOnce(url);
      } catch (error) {
        const described = this.describe(error, url);
        if (attempt >= this.options.retries || !isRetryable(error)) throw described;
        const delayMs = this.options.retryDelayMs * (attempt + 1);
        this.options.onRetry({ attempt: attempt + 1, retries: this.options.retries, delayMs, reason: described.message });
        await this.options.sleep(delayMs);
      }
    }
  }

  private async requestOnce(url: URL): Promise<string> {
    const response = await this.send(url.toString(), { signal: AbortSignal.timeout(this.options.timeoutMs) });
    const body = await response.text();
    if (!response.ok) throw new HttpError(response.status, url, body);
    return body;
  }

  // 네트워크 오류 메시지에 주소가 섞여 인증키가 새지 않도록 다시 감싼다
  private describe(error: unknown, url: URL): Error {
    if (error instanceof HttpError) return error;
    const code = causeCodeOf(error);
    const reason = isTimeout(error) ? `${this.options.timeoutMs}ms 안에 응답 없음` : `네트워크 오류${code ? ` (${code})` : ''}`;
    return new Error(`${reason}: ${redactUrl(url)}`);
  }
}

function isTimeout(error: unknown) {
  return error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
}

// fetch는 'fetch failed'만 알려주고 진짜 원인(ECONNRESET, ENOTFOUND 등)은 cause에 담는다
function causeCodeOf(error: unknown): string | null {
  if (!(error instanceof Error) || typeof error.cause !== 'object' || error.cause === null) return null;
  const code = (error.cause as { code?: unknown }).code;
  return typeof code === 'string' ? code : null;
}

function isRetryable(error: unknown) {
  return error instanceof HttpError ? error.retryable : true;
}
