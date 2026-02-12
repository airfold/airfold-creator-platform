import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';

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
 * Wraps Clerk hooks with a stable interface for the app.
 * In dev skip mode, returns a mock user.
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();

  const devMode = isDevMode();
  const nativeToken = getNativeToken();

  if (devMode) {
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

  // Native mode — opened from iOS app with a JWT
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

  return {
    user: isSignedIn && user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? '',
      name: user.fullName ?? user.firstName ?? 'Creator',
      avatar: user.imageUrl,
    } : null,
    isAuthenticated: !!isSignedIn,
    isLoaded,
    logout: () => signOut(),
    getToken: () => getToken(),
  };
}
