import type { Fetch } from '../../http/http-client';

type Reply = { status?: number; body: string } | Error;

// 요청 주소를 기록하고, 주소에 맞는 응답을 차례로 돌려주는 테스트용 fetch
export class FakeFetch {
  readonly requests: URL[] = [];
  private readonly routes: { match: (url: URL) => boolean; replies: Reply[] }[] = [];

  on(match: (url: URL) => boolean, ...replies: Reply[]) {
    this.routes.push({ match, replies });
    return this;
  }

  readonly fetch: Fetch = async (input) => {
    const url = new URL(input);
    this.requests.push(url);
    const route = this.routes.find((r) => r.match(url));
    if (!route) throw new Error(`준비되지 않은 요청: ${url.pathname}`);
    const reply = route.replies.length > 1 ? route.replies.shift()! : route.replies[0];
    if (reply instanceof Error) throw reply;
    return new Response(reply.body, { status: reply.status ?? 200 });
  };
}

export const timeoutError = () => Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' });
export const networkError = (code?: string) =>
  new TypeError('fetch failed', code ? { cause: Object.assign(new Error(code), { code }) } : undefined);
