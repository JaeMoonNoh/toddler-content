export type Fetch = (url: string, init?: { signal?: AbortSignal }) => Promise<Response>;

export interface HttpClientOptions {
  timeoutMs: number;
  retries: number;
  retryDelayMs: number;
  sleep: (ms: number) => Promise<void>;
}

const DEFAULTS: HttpClientOptions = {
  timeoutMs: 30_000,
  retries: 2,
  retryDelayMs: 1_000,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
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
        if (attempt >= this.options.retries || !isRetryable(error)) throw this.describe(error, url);
        await this.options.sleep(this.options.retryDelayMs * (attempt + 1));
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
    const reason = isTimeout(error) ? `${this.options.timeoutMs}ms 안에 응답 없음` : '네트워크 오류';
    return new Error(`${reason}: ${redactUrl(url)}`);
  }
}

function isTimeout(error: unknown) {
  return error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
}

function isRetryable(error: unknown) {
  return error instanceof HttpError ? error.retryable : true;
}
