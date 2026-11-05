import { LoginStatus } from '@/account/ui/login-status';
import { fetchPublishedBenefits } from '@/benefits/api/fetch-benefits';
import { fetchRegionDirectory } from '@/benefits/api/fetch-regions';
import { BenefitFinder } from '@/benefits/ui/benefit-finder';

// 요청 때 API에서 받는다 (빌드할 때는 API가 없다). 응답은 5분 동안 재사용한다
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [result, regions] = await Promise.all([fetchPublishedBenefits(), fetchRegionDirectory()]);
  return (
    <main className="page">
      <header className="top">
        <LoginStatus />
        <h1>출산예정일만 넣으면, 받을 수 있는 혜택을 한눈에</h1>
        <p>로그인 없이 바로 볼 수 있어요. 입력한 정보는 이 화면 밖으로 나가지 않아요.</p>
      </header>
      {result.ok && regions.ok ? (
        <BenefitFinder benefits={result.benefits} regions={regions.directory} />
      ) : (
        <p className="error">혜택 정보를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</p>
      )}
      <footer className="src">
        원본: 보조금24(행정안전부), 복지로(한국사회보장정보원). 이 사이트는 공공 정보를 보기 쉽게 다시 정리할 뿐이며, 실제 신청 전
        각 혜택의 원문에서 확인해 주세요. &quot;검증 전&quot;은 아직 사람이 원문과 대조하지 않은 혜택이에요.
        {regions.ok && ` 행정구역은 ${regions.directory.source} ${regions.directory.fetchedOn} 기준이에요.`}
      </footer>
    </main>
  );
}
