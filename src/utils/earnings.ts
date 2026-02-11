/**
 * Airfold Creator Earnings Calculator
 *
 * Payment Structure:
 * - Base rate: $2 per Qualified Active User (QAU) per week
 * - Streak multipliers for consecutive weeks maintaining 70%+ of peak QAU
 * - Platform kickback: QAUs from Airfold platform = 1.5x value
 * - $2 per new Airfold signup attributed to creator's app
 * - Weekly cap: $2,000
 * - Monthly cap: $5,000
 */

/** Base rate per QAU per week in dollars */
const BASE_RATE = 2;

/** Bonus per new signup attributed to creator */
const SIGNUP_BONUS = 2;

/** Platform user multiplier (internal Airfold users are worth more) */
const PLATFORM_MULTIPLIER = 1.5;

/** External user multiplier */
const EXTERNAL_MULTIPLIER = 1.0;

/** Weekly earnings cap */
export const WEEKLY_CAP = 2000;

/** Monthly earnings cap */
export const MONTHLY_CAP = 5000;

/** Minimum QAU retention percentage to maintain streak */
const STREAK_THRESHOLD = 0.7;

/**
 * Streak multiplier tiers based on consecutive qualifying weeks
 *
 * @param streakWeek - Number of consecutive weeks maintaining 70%+ of peak QAU
 * @returns The multiplier applied to base earnings
 */
export function getStreakMultiplier(streakWeek: number): number {
  if (streakWeek <= 2) return 1.0;
  if (streakWeek <= 4) return 1.3;
  if (streakWeek <= 8) return 1.6;
  return 2.0;
}

/**
 * Returns the label for the current streak tier
 *
 * @param streakWeek - Current streak week number
 * @returns Human-readable tier label
 */
export function getStreakTierLabel(streakWeek: number): string {
  if (streakWeek <= 2) return 'Starter';
  if (streakWeek <= 4) return 'Rising';
  if (streakWeek <= 8) return 'Trending';
  return 'Elite';
}

/**
 * Returns the color associated with the current streak tier
 */
export function getStreakTierColor(streakWeek: number): string {
  if (streakWeek <= 2) return '#94a3b8';
  if (streakWeek <= 4) return '#3b82f6';
  if (streakWeek <= 8) return '#8b5cf6';
  return '#f59e0b';
}

/**
 * Calculates the effective QAU value considering platform vs external sources
 *
 * @param totalQAU - Total qualified active users for the week
 * @param platformPercent - Percentage of QAUs from the Airfold platform (0-100)
 * @returns Effective QAU value after applying platform multiplier
 */
export function calculateEffectiveQAU(totalQAU: number, platformPercent: number): number {
  const platformFraction = platformPercent / 100;
  const platformQAU = totalQAU * platformFraction * PLATFORM_MULTIPLIER;
  const externalQAU = totalQAU * (1 - platformFraction) * EXTERNAL_MULTIPLIER;
  return platformQAU + externalQAU;
}

/**
 * Calculates weekly earnings before caps
 *
 * @param qau - Qualified active users for the week
 * @param streakWeek - Current streak week number
 * @param platformPercent - Percentage of QAUs from Airfold platform (0-100)
 * @param newSignups - Number of new Airfold signups attributed to this creator
 * @returns Breakdown of earnings components
 */
export function calculateWeeklyEarnings(
  qau: number,
  streakWeek: number,
  platformPercent: number = 60,
  newSignups: number = 0
): {
  baseEarnings: number;
  effectiveQAU: number;
  multiplier: number;
  platformBonus: number;
  signupBonus: number;
  subtotal: number;
  capped: number;
  capApplied: boolean;
} {
  const multiplier = getStreakMultiplier(streakWeek);
  const effectiveQAU = calculateEffectiveQAU(qau, platformPercent);
  const baseEarnings = qau * BASE_RATE;
  const platformBonus = (effectiveQAU - qau) * BASE_RATE;
  const signupBonus = newSignups * SIGNUP_BONUS;
  const subtotal = effectiveQAU * BASE_RATE * multiplier + signupBonus;
  const capped = Math.min(subtotal, WEEKLY_CAP);
  const capApplied = subtotal > WEEKLY_CAP;

  return {
    baseEarnings,
    effectiveQAU,
    multiplier,
    platformBonus: platformBonus * multiplier,
    signupBonus,
    subtotal,
    capped,
    capApplied,
  };
}

/**
 * Calculates monthly earnings with monthly cap enforcement
 *
 * @param weeklyEarnings - Array of 4 weekly capped earnings values
 * @returns Monthly total with cap applied
 */
export function calculateMonthlyEarnings(weeklyEarnings: number[]): {
  total: number;
  capped: number;
  capApplied: boolean;
} {
  const total = weeklyEarnings.reduce((sum, w) => sum + w, 0);
  const capped = Math.min(total, MONTHLY_CAP);
  return { total, capped, capApplied: total > MONTHLY_CAP };
}

/**
 * Determines if a creator maintains their streak based on QAU history
 *
 * @param currentQAU - This week's QAU
 * @param peakQAU - Highest QAU achieved during the streak
 * @returns Whether the streak is maintained
 */
export function isStreakMaintained(currentQAU: number, peakQAU: number): boolean {
  if (peakQAU === 0) return currentQAU > 0;
  return currentQAU >= peakQAU * STREAK_THRESHOLD;
}

/**
 * Formats a dollar amount for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number with commas
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Calculates percentage change between two values
 */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
