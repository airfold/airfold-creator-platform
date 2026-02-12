import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';

/**
 * Wraps Clerk hooks with a stable interface for the app.
 * Replaces the old custom AuthContext.
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();

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
