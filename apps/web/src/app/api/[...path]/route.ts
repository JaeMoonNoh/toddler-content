// 브라우저가 부르는 API는 웹 주소(/api/*)를 거쳐 넘긴다. 로그인 쿠키를 웹 주소에 두고, 다른 주소로 부르는 CORS를 피하려고
const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
// 브라우저에서 부를 일이 있는 경로만 연다
const ALLOWED_ROOTS = ['auth'];
const FORWARDED_REQUEST_HEADERS = ['cookie', 'content-type', 'accept'];
// fetch가 이미 풀어 준 본문이라 길이·압축 헤더를 그대로 넘기면 깨진다
const DROPPED_RESPONSE_HEADERS = ['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie'];

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, { params }: Context): Promise<Response> {
  const { path } = await params;
  if (!ALLOWED_ROOTS.includes(path[0])) return new Response(null, { status: 404 });

  const target = `${API_BASE}/${path.map(encodeURIComponent).join('/')}${new URL(request.url).search}`;
  const response = await fetch(target, {
    method: request.method,
    headers: pick(request.headers, FORWARDED_REQUEST_HEADERS),
    body: request.method === 'GET' ? undefined : await request.arrayBuffer(),
    redirect: 'manual', // 카카오 로그인 화면으로 보내는 302를 브라우저가 직접 따라가게 한다
    cache: 'no-store',
  });
  return new Response(response.body, { status: response.status, headers: responseHeadersOf(response) });
}

function pick(headers: Headers, names: string[]): Headers {
  const picked = new Headers();
  for (const name of names) {
    const value = headers.get(name);
    if (value) picked.set(name, value);
  }
  return picked;
}

function responseHeadersOf(response: Response): Headers {
  const headers = new Headers();
  response.headers.forEach((value, name) => {
    if (!DROPPED_RESPONSE_HEADERS.includes(name)) headers.set(name, value);
  });
  // Set-Cookie는 여러 개가 올 수 있어서 하나씩 붙인다
  for (const cookie of response.headers.getSetCookie()) headers.append('set-cookie', cookie);
  return headers;
}

export { forward as GET, forward as POST };
