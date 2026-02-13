const API_URL = import.meta.env.VITE_API_URL as string | undefined;
if (!API_URL && import.meta.env.PROD) {
  console.error('VITE_API_URL is not set — API calls will fail');
}

type GetToken = () => Promise<string | null>;

let _getToken: GetToken | null = null;

export function setTokenGetter(fn: GetToken) {
  _getToken = fn;
}

async function authHeaders(): Promise<HeadersInit> {
  // 4C: Try custom getter first, fall back to sessionStorage (native WKWebView token)
  let token: string | null = null;
  if (_getToken) {
    token = await _getToken();
  }
  if (!token) {
    token = sessionStorage.getItem('native_token');
  }
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers, ...options?.headers },
  });
  if (!res.ok) {
    // 4B: Parse error body for detail message
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch { /* ignore parse errors */ }
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json();
}

// ─── Types (matching backend schemas) ───

export interface AppResponse {
  id: string;
  name: string;
  description: string | null;
  status: string;
  icon_url: string | null;
  cover_image_url: string | null;
  category: string | null;
  user_count: number;
  prod_app_url: string | null;
  prod_deployment_status: string | null;
  prod_cf_worker_name: string | null;
  dev_app_url: string | null;
  dev_deployment_status: string | null;
  created_at: string;
  is_remix: boolean;
  remix_source_app_id: string | null;
}

export interface DauPoint {
  day: string;
  users: number;
}

export interface GeoEntry {
  country: string;
  users: number;
}

export interface DeviceEntry {
  device_type: string;
  count: number;
}

export interface AppStats {
  worker_name: string;
  views: number;
  unique_users: number;
}

export interface CreatorAnalyticsResponse {
  dau: DauPoint[];
  total_views: number;
  unique_users: number;
  geo: GeoEntry[];
  devices: DeviceEntry[];
  per_app: AppStats[];
}

export interface AppAnalyticsResponse {
  dau: DauPoint[];
  total_views: number;
  unique_users: number;
  geo: GeoEntry[];
  devices: DeviceEntry[];
}

// ─── Creator Dashboard Types ───

export interface WeeklyEarningsEntry {
  week_start: string;
  app_id: string;
  app_name: string;
  qau: number;
  gross: number;
  capped: number;
}

export interface CreatorEarningsResponse {
  weekly: WeeklyEarningsEntry[];
  totals: { total_qau: number; total_gross: number; total_capped: number };
}

export interface HealthMetrics {
  same_ip_percent: number;
  bounce_rate: number;
  avg_session_seconds: number;
}

export interface CreatorHealthResponse {
  score: number;
  status: string;
  metrics: HealthMetrics;
  flags: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  avatar: string | null;
  qau: number;
  app_count: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  my_rank: { rank: number; qau: number } | null;
}

// ─── Stripe Connect Types ───

export interface ConnectAccountStatus {
  has_account: boolean;
  onboarding_complete: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export interface OnboardingLinkResponse {
  url: string;
}

// ─── API Methods ───

export async function fetchMyApps(): Promise<AppResponse[]> {
  const data = await request<{ items: AppResponse[] }>('/v1/app');
  return data.items;
}

export async function fetchCreatorAnalytics(period: string = '30d'): Promise<CreatorAnalyticsResponse> {
  const params = new URLSearchParams({ period });
  return request<CreatorAnalyticsResponse>(`/v1/analytics/creator?${params}`);
}

export async function fetchAppAnalytics(appId: string, period: string = '30d'): Promise<AppAnalyticsResponse> {
  const params = new URLSearchParams({ period });
  return request<AppAnalyticsResponse>(`/v1/analytics/app/${encodeURIComponent(appId)}?${params}`);
}

export async function fetchCreatorEarnings(period?: string): Promise<CreatorEarningsResponse> {
  const params = period ? `?period=${period}` : '';
  return request<CreatorEarningsResponse>(`/v1/creator/earnings${params}`);
}

export async function fetchAppEarnings(appId: string, period?: string): Promise<CreatorEarningsResponse> {
  const params = period ? `?${new URLSearchParams({ period })}` : '';
  return request<CreatorEarningsResponse>(`/v1/creator/earnings/app/${encodeURIComponent(appId)}${params}`);
}

export async function fetchCreatorHealth(): Promise<CreatorHealthResponse> {
  return request<CreatorHealthResponse>('/v1/creator/health');
}

export async function fetchAppHealth(appId: string): Promise<CreatorHealthResponse> {
  return request<CreatorHealthResponse>(`/v1/creator/health/app/${encodeURIComponent(appId)}`);
}

export async function fetchLeaderboard(period: string = 'week', limit?: number): Promise<LeaderboardResponse> {
  const params = new URLSearchParams({ period });
  if (limit) params.set('limit', String(limit));
  return request<LeaderboardResponse>(`/v1/leaderboard?${params}`);
}

// ─── Stripe Connect ───

export async function fetchConnectStatus(): Promise<ConnectAccountStatus> {
  return request<ConnectAccountStatus>('/v1/stripe/connect/status');
}

export async function startConnectOnboarding(): Promise<OnboardingLinkResponse> {
  return request<OnboardingLinkResponse>('/v1/stripe/connect/onboard', { method: 'POST' });
}

export async function refreshOnboardingLink(): Promise<OnboardingLinkResponse> {
  return request<OnboardingLinkResponse>('/v1/stripe/connect/refresh-link', { method: 'POST' });
}
