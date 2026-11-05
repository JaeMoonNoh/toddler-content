import { MyPage } from '@/account/ui/my-page';

export const metadata = { title: '마이페이지 · ToddlerContent' };

export default function MyPageRoute() {
  return (
    <main className="page narrow">
      <header className="top">
        <a href="/">← 혜택 보기</a>
        <h1>마이페이지</h1>
      </header>
      <MyPage />
    </main>
  );
}
