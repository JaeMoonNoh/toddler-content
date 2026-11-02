// 요청마다 API 상태를 새로 확인한다 (빌드 시점에 고정하지 않음)
export const dynamic = 'force-dynamic';

async function getApiStatus(): Promise<string> {
  // 컨테이너 안에서는 서비스 이름(api)으로, 로컬 개발에서는 localhost로 접속
  const base = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/health`, { cache: 'no-store' });
    const body = (await res.json()) as { status: string };
    return body.status;
  } catch {
    return '연결 실패';
  }
}

export default async function Home() {
  const apiStatus = await getApiStatus();
  return (
    <main>
      <h1>출산 혜택 타임라인</h1>
      <p>스켈레톤 화면입니다.</p>
      <p>
        API 상태: <strong>{apiStatus}</strong>
      </p>
    </main>
  );
}
