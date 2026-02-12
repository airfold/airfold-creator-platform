export interface CreatorApp {
  id: string;
  appName: string;
  category: string;
  rating: number;
  ratingCount: number;
  /** QAU values for last 8 weeks, oldest first */
  weeklyQAU: number[];
  healthScore: number;
  flags: string[];
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  apps: CreatorApp[];
  avatar: string | null;
  joinedWeeksAgo: number;
}
