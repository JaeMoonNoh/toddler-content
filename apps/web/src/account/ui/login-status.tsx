'use client';

import { useEffect, useState } from 'react';
import { fetchLoginState, type LoginState, loginUrl, logout } from '../api/auth-client';

const PROVIDER_LABELS: Record<string, string> = { kakao: '카카오로 로그인' };

// 로그인은 선택이다. 로그인하지 않아도 모든 혜택을 그대로 볼 수 있다
export function LoginStatus() {
  const [state, setState] = useState<LoginState | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    void fetchLoginState().then(setState);
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'failed') {
      setFailed(true);
      // 새로고침해도 안내가 다시 뜨지 않게 주소에서 뗀다
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (!state) return null;
  if (state.loggedIn) {
    return (
      <div className="login">
        <span>로그인했어요</span>
        <button type="button" className="linkbtn" onClick={() => void logout().then(() => setState({ ...state, loggedIn: false }))}>
          로그아웃
        </button>
      </div>
    );
  }
  if (state.providers.length === 0) return null;
  return (
    <div className="login">
      {failed && <span className="login-failed">로그인하지 못했어요. 다시 시도해 주세요.</span>}
      {state.providers.map((provider) => (
        <a key={provider} className={`login-btn login-${provider}`} href={loginUrl(provider)}>
          {PROVIDER_LABELS[provider] ?? `${provider} 로그인`}
        </a>
      ))}
    </div>
  );
}
