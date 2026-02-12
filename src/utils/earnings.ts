/**
 * airfold Creator Earnings Calculator
 *
 * Payment Structure:
 * - $2 per Qualified Active User (QAU) per week
 * - Weekly cap: $2,000
 * - Monthly cap: $5,000
 *
 * QAU Definition:
 * A user who opens the creator's app on 3+ different days in a single week,
 * with each session lasting at least 1 minute. Must be authenticated with
 * a verified .edu email and not flagged as bot/fake traffic.
 */

/** Rate per QAU per week in dollars */
const RATE_PER_QAU = 2;

/** Weekly earnings cap */
const WEEKLY_CAP = 2000;

/** Monthly earnings cap */
const MONTHLY_CAP = 5000;

/**
 * Calculates weekly earnings: QAU count x $2, capped at $2,000
 *
 * @param qau - Qualified active users for the week
 * @returns Breakdown of earnings
 */
export function calculateWeeklyEarnings(qau: number): {
  earnings: number;
  capped: number;
  capApplied: boolean;
} {
  const earnings = qau * RATE_PER_QAU;
  const capped = Math.min(earnings, WEEKLY_CAP);
  return {
    earnings,
    capped,
    capApplied: earnings > WEEKLY_CAP,
  };
}

/**
 * Calculates monthly earnings with monthly cap enforcement
 *
 * @param weeklyEarnings - Array of weekly capped earnings values
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
