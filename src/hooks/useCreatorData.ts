import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchMyApps,
  fetchCreatorAnalytics,
  fetchAppAnalytics,
  fetchCreatorEarnings,
  fetchAppEarnings,
  fetchCreatorHealth,
  fetchAppHealth,
  fetchLeaderboard,
  fetchConnectStatus,
} from '../services/api';

/** Fetch creator's apps */
export function useMyApps() {
  return useQuery({
    queryKey: ['myApps'],
    queryFn: fetchMyApps,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch creator analytics */
export function useCreatorAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['creatorAnalytics', period],
    queryFn: () => fetchCreatorAnalytics(period),
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch per-app analytics */
export function useAppAnalytics(appId: string | null, period: string = '30d') {
  return useQuery({
    queryKey: ['appAnalytics', appId, period],
    queryFn: () => fetchAppAnalytics(appId!, period),
    enabled: !!appId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch creator earnings */
export function useCreatorEarnings(appId?: string | null) {
  return useQuery({
    queryKey: ['creatorEarnings', appId ?? null],
    queryFn: () => {
      if (appId) return fetchAppEarnings(appId);
      return fetchCreatorEarnings();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch creator health */
export function useCreatorHealth(appId?: string | null) {
  return useQuery({
    queryKey: ['creatorHealth', appId ?? null],
    queryFn: () => {
      if (appId) return fetchAppHealth(appId);
      return fetchCreatorHealth();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch Stripe Connect payout status */
export function usePayoutStatus() {
  return useQuery({
    queryKey: ['payoutStatus'],
    queryFn: fetchConnectStatus,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

/** Fetch leaderboard */
export function useLeaderboard(period: string = 'week') {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => fetchLeaderboard(period),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
