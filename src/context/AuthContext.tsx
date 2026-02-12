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
 * Wraps Clerk hooks with a stable interface for the app.
 * In dev skip mode, returns a mock user.
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();

  const devMode = isDevMode();

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
