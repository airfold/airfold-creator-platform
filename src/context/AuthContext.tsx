/** Check if dev skip mode is active */
export function isDevMode(): boolean {
  return localStorage.getItem('dev_skip') === '1';
}

/** Enable dev skip mode */
export function enableDevMode() {
  localStorage.setItem('dev_skip', '1');
}

/** Disable dev skip mode */
export function clearDevMode() {
  localStorage.removeItem('dev_skip');
}

/**
 * Native token mode — when opened from the iOS app with a JWT token.
 * The token is passed as ?__clerk_token=xxx and stored in sessionStorage.
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
 * Auth hook — dev mode returns mock user, native mode uses iOS JWT.
 * No web sign-in flow; dashboard is only accessible from the iOS app.
 */
export function useAuth() {
  const nativeToken = getNativeToken();

  if (isDevMode()) {
    return {
      user: {
        id: 'dev_9',
        email: 'david@airfold.co',
        name: 'David Chikly',
        avatar: undefined,
      },
      isAuthenticated: true,
      isLoaded: true,
      logout: () => { clearDevMode(); window.location.href = '/'; },
      getToken: () => Promise.resolve('dev-token'),
    };
  }

  if (nativeToken) {
    return {
      user: {
        id: 'native_user',
        email: '',
        name: 'Creator',
        avatar: undefined,
      },
      isAuthenticated: true,
      isLoaded: true,
      logout: () => { sessionStorage.removeItem('native_token'); window.location.href = '/'; },
      getToken: () => Promise.resolve(nativeToken),
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
