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
  fetchPayoutHistory,
} from '../services/api';

/** Fetch creator's apps */
export function useMyApps() {
  return useQuery({
    queryKey: ['myApps'],
    queryFn: fetchMyApps,
    placeholderData: keepPreviousData,
  });
}

/** Fetch creator analytics */
export function useCreatorAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['creatorAnalytics', period],
    queryFn: () => fetchCreatorAnalytics(period),
    placeholderData: keepPreviousData,
  });
}

/** Fetch per-app analytics */
export function useAppAnalytics(appId: string | null, period: string = '30d') {
  return useQuery({
    queryKey: ['appAnalytics', appId, period],
    queryFn: () => fetchAppAnalytics(appId!, period),
    enabled: !!appId,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
  });
}

/** Fetch Stripe Connect payout status */
export function usePayoutStatus() {
  return useQuery({
    queryKey: ['payoutStatus'],
    queryFn: fetchConnectStatus,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}

/** Fetch payout history */
export function usePayoutHistory() {
  return useQuery({
    queryKey: ['payoutHistory'],
    queryFn: fetchPayoutHistory,
    placeholderData: keepPreviousData,
  });
}

/** Fetch leaderboard */
export function useLeaderboard(period: string = 'week') {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => fetchLeaderboard(period),
    placeholderData: keepPreviousData,
  });
}
