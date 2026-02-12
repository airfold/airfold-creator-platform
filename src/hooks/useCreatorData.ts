import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { isDevMode } from '../context/AuthContext';
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
import { getCurrentCreator, getCreatorTotalQAU, getCreatorAvgHealthScore, creators } from '../data/creators';
import { calculateWeeklyEarnings } from '../utils/earnings';
import type { AppResponse, CreatorAnalyticsResponse, AppAnalyticsResponse, CreatorEarningsResponse, CreatorHealthResponse, LeaderboardResponse, ConnectAccountStatus } from '../services/api';

// ─── Mock data generators (dev mode) ───

function mockApps(): AppResponse[] {
  const creator = getCurrentCreator();
  return creator.apps.map(app => ({
    id: app.id,
    name: app.appName,
    description: `${app.appName} — a ${app.category.toLowerCase()} app`,
    status: 'ACTIVE',
    icon_url: null,
    cover_image_url: null,
    category: app.category,
    user_count: app.weeklyQAU[7],
    prod_app_url: null,
    prod_deployment_status: 'DEPLOYED',
    prod_cf_worker_name: `app-${app.id}`,
    dev_app_url: null,
    dev_deployment_status: 'DEPLOYED',
    created_at: new Date(Date.now() - creator.joinedWeeksAgo * 7 * 86400000).toISOString(),
    is_remix: false,
    remix_source_app_id: null,
  }));
}

function mockCreatorAnalytics(): CreatorAnalyticsResponse {
  const creator = getCurrentCreator();
  // Aggregate across all apps
  const totalCurrentQAU = creator.apps.reduce((sum, app) => sum + app.weeklyQAU[7], 0);
  const dau = Array.from({ length: 30 }, (_, i) => ({
    day: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    users: Math.round(totalCurrentQAU * (0.3 + Math.random() * 0.4) * (1 + Math.sin(i / 5) * 0.2)),
  }));
  return {
    dau,
    total_views: totalCurrentQAU * 12,
    unique_users: Math.round(totalCurrentQAU * 1.6),
    geo: [
      { country: 'US', users: Math.round(totalCurrentQAU * 0.7) },
      { country: 'CA', users: Math.round(totalCurrentQAU * 0.15) },
      { country: 'UK', users: Math.round(totalCurrentQAU * 0.1) },
      { country: 'Other', users: Math.round(totalCurrentQAU * 0.05) },
    ],
    devices: [
      { device_type: 'mobile', count: Math.round(totalCurrentQAU * 8) },
      { device_type: 'desktop', count: Math.round(totalCurrentQAU * 3) },
      { device_type: 'tablet', count: Math.round(totalCurrentQAU * 1) },
    ],
    per_app: creator.apps.map(app => ({
      worker_name: `app-${app.id}`,
      views: app.weeklyQAU[7] * 12,
      unique_users: Math.round(app.weeklyQAU[7] * 1.6),
    })),
  };
}

function mockAppAnalytics(appId: string): AppAnalyticsResponse {
  const creator = getCurrentCreator();
  const app = creator.apps.find(a => a.id === appId);
  const currentQAU = app ? app.weeklyQAU[7] : 0;
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
export function useAppAnalytics(appId: string | null, period: string = '30d') {
  return useQuery({
    queryKey: ['appAnalytics', appId, period],
    queryFn: () => {
      if (isDevMode()) return Promise.resolve(mockAppAnalytics(appId!));
      return fetchAppAnalytics(appId!, period);
    },
    enabled: !!appId,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Creator Dashboard Hooks (real API in prod, mock in dev) ───

/** Mock earnings response from creator mock data */
function mockCreatorEarningsResponse(appId?: string | null): CreatorEarningsResponse {
  const creator = getCurrentCreator();
  const apps = appId ? creator.apps.filter(a => a.id === appId) : creator.apps;
  const weeklyQAU = appId
    ? (apps[0]?.weeklyQAU ?? Array(8).fill(0))
    : getCreatorTotalQAU(creator);

  const weekly = weeklyQAU.map((qau, i) => {
    const e = calculateWeeklyEarnings(qau);
    const weekDate = new Date(Date.now() - (7 - i) * 7 * 86400000);
    return {
      week_start: weekDate.toISOString().split('T')[0],
      app_id: appId ?? 'all',
      app_name: appId ? (apps[0]?.appName ?? '') : 'All Apps',
      qau,
      gross: e.earnings,
      capped: e.capped,
    };
  });
  return {
    weekly,
    totals: {
      total_qau: weekly.reduce((s, w) => s + w.qau, 0),
      total_gross: weekly.reduce((s, w) => s + w.gross, 0),
      total_capped: weekly.reduce((s, w) => s + w.capped, 0),
    },
  };
}

/** Fetch creator earnings — real API or mock in dev mode */
export function useCreatorEarnings(appId?: string | null) {
  return useQuery({
    queryKey: ['creatorEarnings', appId],
    queryFn: () => {
      if (isDevMode()) return Promise.resolve(mockCreatorEarningsResponse(appId));
      if (appId) return fetchAppEarnings(appId);
      return fetchCreatorEarnings();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Compute health score from metrics (mirrors backend logic) */
function computeScoreFromMetrics(metrics: { same_ip_percent: number; bounce_rate: number; avg_session_seconds: number }) {
  let score = 100;
  if (metrics.avg_session_seconds < 30) score -= 25;
  else if (metrics.avg_session_seconds < 60) score -= 10;
  if (metrics.bounce_rate > 60) score -= 25;
  else if (metrics.bounce_rate > 40) score -= 10;
  if (metrics.same_ip_percent > 30) score -= 30;
  else if (metrics.same_ip_percent > 15) score -= 10;
  return Math.max(0, Math.min(100, score));
}

/** Mock health response from creator mock data */
function mockHealthResponse(appId?: string | null): CreatorHealthResponse {
  const creator = getCurrentCreator();
  const selectedApp = appId ? creator.apps.find(a => a.id === appId) : null;
  const flags = selectedApp ? selectedApp.flags : [...new Set(creator.apps.flatMap(a => a.flags))];

  const metrics = {
    same_ip_percent: flags.includes('same_ip_cluster') ? 42 : 3,
    bounce_rate: flags.includes('high_bounce_rate') ? 68 : 22,
    avg_session_seconds: flags.includes('low_session_time') ? 18 : 272,
  };
  const score = computeScoreFromMetrics(metrics);

  return {
    score,
    status: score >= 80 ? 'eligible' : score >= 50 ? 'at_risk' : 'under_review',
    metrics,
    flags,
  };
}

/** Fetch creator health — real API or mock in dev mode */
export function useCreatorHealth(appId?: string | null) {
  return useQuery({
    queryKey: ['creatorHealth', appId],
    queryFn: () => {
      if (isDevMode()) return Promise.resolve(mockHealthResponse(appId));
      if (appId) return fetchAppHealth(appId);
      return fetchCreatorHealth();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Mock leaderboard response from creator mock data */
function mockLeaderboardResponse(period: string): LeaderboardResponse {
  const currentCreator = getCurrentCreator();

  const sorted = [...creators]
    .map(c => {
      const totalQAU = getCreatorTotalQAU(c);
      let qau: number;
      if (period === 'week') qau = totalQAU[7];
      else if (period === 'month') qau = totalQAU.slice(-4).reduce((s, v) => s + v, 0);
      else qau = totalQAU.reduce((s, v) => s + v, 0);
      return { ...c, qau };
    })
    .sort((a, b) => b.qau - a.qau)
    .slice(0, 20);

  const entries = sorted.map((c, i) => ({
    rank: i + 1,
    user_id: c.id,
    name: c.name,
    avatar: c.avatar,
    qau: c.qau,
    app_count: c.apps.length,
  }));

  const myEntry = entries.find(e => e.user_id === currentCreator.id);

  return {
    entries,
    my_rank: myEntry ? { rank: myEntry.rank, qau: myEntry.qau } : null,
  };
}

/** Mock payout status for dev mode */
function mockPayoutStatus(): ConnectAccountStatus {
  return {
    has_account: false,
    onboarding_complete: false,
    payouts_enabled: false,
    details_submitted: false,
  };
}

/** Fetch Stripe Connect payout status — real API or mock in dev mode */
export function usePayoutStatus() {
  return useQuery({
    queryKey: ['payoutStatus'],
    queryFn: () => isDevMode() ? Promise.resolve(mockPayoutStatus()) : fetchConnectStatus(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch leaderboard — real API or mock in dev mode */
export function useLeaderboard(period: string = 'week') {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => {
      if (isDevMode()) return Promise.resolve(mockLeaderboardResponse(period));
      return fetchLeaderboard(period);
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
