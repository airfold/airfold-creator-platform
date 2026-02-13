/**
 * Native token mode — when opened from the iOS app with a JWT token.
 * The token is injected into sessionStorage by the WKWebView at document start.
 * This lets the web dashboard authenticate without Clerk's web sign-in flow.
 */
export function initNativeToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('__clerk_token');
  if (token) {
    sessionStorage.setItem('native_token', token);
    // Clean the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('__clerk_token');
    window.history.replaceState({}, '', url.pathname + url.hash);
  }
}

export function getNativeToken(): string | null {
  return sessionStorage.getItem('native_token');
}

export function isNativeMode(): boolean {
  return !!getNativeToken();
}

/**
 * Auth hook — native mode uses iOS JWT.
 * Dashboard is only accessible from the iOS app.
 */
export function useAuth() {
  const nativeToken = getNativeToken();

  if (nativeToken) {
    const nativeName = sessionStorage.getItem('native_user_name') || 'Creator';
    return {
      user: {
        id: 'native_user',
        email: '',
        name: nativeName,
        avatar: undefined,
      },
      isAuthenticated: true,
      isLoaded: true,
      logout: () => { sessionStorage.removeItem('native_token'); window.location.href = '/'; },
      getToken: () => Promise.resolve(sessionStorage.getItem('native_token')),
    };
  }

  // Local dev server (npm run dev) — allow access without auth for API testing
  if (import.meta.env.DEV) {
    return {
      user: {
        id: 'local_dev',
        email: 'dev@airfold.co',
        name: 'Local Dev',
        avatar: undefined,
      },
      isAuthenticated: true,
      isLoaded: true,
      logout: () => {},
      getToken: () => Promise.resolve('local-dev-token'),
    };
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoaded: true,
    logout: () => {},
    getToken: () => Promise.resolve(null as string | null),
  };
}
