export interface Creator {
  id: string;
  name: string;
  email: string;
  appName: string;
  category: string;
  avatar: string | null;
  rating: number;
  ratingCount: number;
  /** QAU values for last 8 weeks, oldest first */
  weeklyQAU: number[];
  healthScore: number;
  flags: string[];
  joinedWeeksAgo: number;
}
