'use client';

import { useEffect, useState } from 'react';
import { type AccountInfo, fetchAccount, fetchSavedBenefitCount, withdraw } from '../api/account-client';
import { deleteConditions, fetchSavedConditions } from '../api/conditions-client';
import type { SavedConditions } from '../domain/saved-conditions';

const PROVIDER_NAMES: Record<string, string> = { kakao: '카카오' };

interface MyPageData {
  account: AccountInfo;
  conditions: SavedConditions | null;
  conditionsUpdatedAt: string | null;
  savedBenefitCount: number;
}

// 로그인한 사람이 계정에 무엇이 저장돼 있는지 보고, 지우거나 탈퇴하는 곳
export function MyPage() {
  const [data, setData] = useState<MyPageData | null | 'logged-out'>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const account = await fetchAccount();
      if (!account) return setData('logged-out');
      const [conditions, savedBenefitCount] = await Promise.all([fetchSavedConditions(), fetchSavedBenefitCount()]);
      setData({
        account,
        conditions: conditions.loggedIn ? conditions.conditions : null,
        conditionsUpdatedAt: conditions.loggedIn ? conditions.updatedAt : null,
        savedBenefitCount,
      });
    })();
  }, []);

  if (data === null) return null;
  if (data === 'logged-out') {
    return (
      <p className="empty">
        로그인하면 볼 수 있어요. <a href="/">혜택 화면으로 가기</a>
      </p>
    );
  }

  const removeConditions = async () => {
    if (!window.confirm('저장한 조건을 지울까요?')) return;
    await deleteConditions().catch((e: Error) => setError(e.message));
    setData({ ...data, conditions: null, conditionsUpdatedAt: null });
  };
  const leave = async () => {
    if (!window.confirm('탈퇴하면 저장한 조건과 저장한 혜택이 모두 지워지고 되돌릴 수 없어요. 탈퇴할까요?')) return;
    try {
      await withdraw();
      window.location.href = '/';
    } catch (e) {
      setError(e instanceof Error ? e.message : '잠시 뒤 다시 시도해 주세요');
    }
  };
  const child = data.conditions?.children[0];

  return (
    <div className="mypage">
      <section className="card">
        <h2>계정</h2>
        <p>
          {data.account.providers.map((provider) => PROVIDER_NAMES[provider] ?? provider).join(', ')}로 로그인 · {koreanDate(data.account.joinedAt)} 가입
        </p>
      </section>

      <section className="card">
        <h2>저장한 조건</h2>
        {data.conditions ? (
          <>
            <p>
              {[child?.dueDate && `출산예정일 ${child.dueDate}`, child?.birthDate && `출생일 ${child.birthDate}`, child?.nickname && `태명 ${child.nickname}`, child?.name && `이름 ${child.name}`]
                .filter(Boolean)
                .join(' · ') || '저장한 날짜·이름이 없어요'}
              {data.conditionsUpdatedAt && <small>{koreanDate(data.conditionsUpdatedAt)} 저장 · 바꾸려면 혜택 화면에서 고친 뒤 저장해요</small>}
            </p>
            <button type="button" className="linkbtn" onClick={() => void removeConditions()}>
              저장한 조건 지우기
            </button>
          </>
        ) : (
          <p>저장한 조건이 없어요. 혜택 화면에서 입력한 뒤 저장할 수 있어요.</p>
        )}
      </section>

      <section className="card">
        <h2>저장한 혜택</h2>
        <p>
          {data.savedBenefitCount}개 <small>혜택 화면의 &quot;저장한 혜택&quot; 탭에서 볼 수 있어요</small>
        </p>
      </section>

      <section className="card">
        <h2>회원 탈퇴</h2>
        <p>
          계정과 저장한 조건, 저장한 혜택을 바로 모두 지워요. 다시 로그인하면 새 계정으로 시작해요.
          <small>카카오 쪽 연결은 카카오 계정 설정의 연결된 서비스 관리에서 끊을 수 있어요.</small>
        </p>
        <button type="button" className="linkbtn danger" onClick={() => void leave()}>
          탈퇴하기
        </button>
      </section>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function koreanDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' });
}
