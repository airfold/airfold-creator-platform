import { useQuery } from '@tanstack/react-query';
import { isDevMode } from '../context/AuthContext';
import { fetchMyApps, fetchCreatorAnalytics, fetchAppAnalytics } from '../services/api';
import { getCurrentCreator, creators, platformStats } from '../data/creators';
import { calculateWeeklyEarnings } from '../utils/earnings';
import type { AppResponse, CreatorAnalyticsResponse, AppAnalyticsResponse } from '../services/api';
import type { Creator } from '../types';

// ─── Mock data generators (dev mode) ───

function mockApps(): AppResponse[] {
  const creator = getCurrentCreator();
  return [{
    id: creator.id,
    name: creator.appName,
    description: `${creator.appName} — a ${creator.category.toLowerCase()} app`,
    status: 'ACTIVE',
    icon_url: null,
    cover_image_url: null,
    category: creator.category,
    user_count: creator.weeklyQAU[7],
    prod_app_url: null,
    prod_deployment_status: 'DEPLOYED',
    prod_cf_worker_name: `app-${creator.id}`,
    dev_app_url: null,
    dev_deployment_status: 'DEPLOYED',
    created_at: new Date(Date.now() - creator.joinedWeeksAgo * 7 * 86400000).toISOString(),
    is_remix: false,
    remix_source_app_id: null,
  }];
}

function mockCreatorAnalytics(): CreatorAnalyticsResponse {
  const creator = getCurrentCreator();
  const currentQAU = creator.weeklyQAU[7];
  const dau = Array.from({ length: 30 }, (_, i) => ({
    day: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    users: Math.round(currentQAU * (0.3 + Math.random() * 0.4) * (1 + Math.sin(i / 5) * 0.2)),
  }));
  return {
    dau,
    total_views: currentQAU * 12,
    unique_users: Math.round(currentQAU * 1.6),
    geo: [
      { country: 'US', users: Math.round(currentQAU * 0.7) },
      { country: 'CA', users: Math.round(currentQAU * 0.15) },
      { country: 'UK', users: Math.round(currentQAU * 0.1) },
      { country: 'Other', users: Math.round(currentQAU * 0.05) },
    ],
    devices: [
      { device_type: 'mobile', count: Math.round(currentQAU * 8) },
      { device_type: 'desktop', count: Math.round(currentQAU * 3) },
      { device_type: 'tablet', count: Math.round(currentQAU * 1) },
    ],
    per_app: [{ worker_name: `app-${creator.id}`, views: currentQAU * 12, unique_users: Math.round(currentQAU * 1.6) }],
  };
}

// ─── Hooks ───

/** Fetch creator's apps — real API or mock in dev mode */
export function useMyApps() {
  return useQuery({
    queryKey: ['myApps'],
    queryFn: () => isDevMode() ? Promise.resolve(mockApps()) : fetchMyApps(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch creator analytics — real API or mock in dev mode */
export function useCreatorAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['creatorAnalytics', period],
    queryFn: () => isDevMode() ? Promise.resolve(mockCreatorAnalytics()) : fetchCreatorAnalytics(period),
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch per-app analytics — real API or mock in dev mode */
export function useAppAnalytics(appId: string | undefined, period: string = '30d') {
  return useQuery({
    queryKey: ['appAnalytics', appId, period],
    queryFn: () => {
      if (isDevMode() || !appId) return Promise.resolve(mockCreatorAnalytics() as AppAnalyticsResponse);
      return fetchAppAnalytics(appId, period);
    },
    enabled: !!appId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get the current creator profile.
 * In dev mode: returns mock creator from creators.ts
 * In prod mode: returns mock creator (earnings/health/leaderboard have no backend yet)
 *
 * TODO: Replace with real /v1/creator endpoint when backend adds it
 */
export function useCurrentCreator(): Creator {
  return getCurrentCreator();
}

/** All creators for leaderboard — mock only (no backend endpoint) */
export function useAllCreators() {
  return { creators, currentCreatorId: getCurrentCreator().id };
}

/** Platform stats — mock only (no backend endpoint) */
export function usePlatformStats() {
  return platformStats;
}
