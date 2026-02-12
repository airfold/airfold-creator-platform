import type { Creator } from '../types';

/**
 * Mock data: early-stage platform, just launched
 * - 9 initial creators (beta cohort)
 * - Low QAU numbers (tens, not hundreds)
 * - Most joined 1-3 weeks ago
 * - 1 flagged for suspicious activity
 */

function generateWeeklyData(pattern: number[], baseQAU: number): number[] {
  return pattern.map(p => Math.round(baseQAU * p));
}

export const creators: Creator[] = [
  {
    id: '1',
    name: 'Maya Chen',
    email: 'maya.chen@stanford.edu',
    avatar: null,
    apps: [{
      id: 'app-1',
      appName: 'StudyMatch',
      category: 'Education',
      rating: 4.5,
      ratingCount: 11,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0.4, 0.7, 1.0], 68),
      healthScore: 91,
      flags: [],
    }],
    joinedWeeksAgo: 3,
  },
  {
    id: '2',
    name: 'Jordan Wright',
    email: 'j.wright@mit.edu',
    avatar: null,
    apps: [{
      id: 'app-2',
      appName: 'CampusEats',
      category: 'Food',
      rating: 4.2,
      ratingCount: 8,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0.5, 0.8, 0.9], 52),
      healthScore: 88,
      flags: [],
    }],
    joinedWeeksAgo: 3,
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.p@berkeley.edu',
    avatar: null,
    apps: [{
      id: 'app-3',
      appName: 'RideShare Cal',
      category: 'Transport',
      rating: 4.8,
      ratingCount: 14,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0.3, 0.6, 1.0], 85),
      healthScore: 95,
      flags: [],
    }],
    joinedWeeksAgo: 3,
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    email: 'marcus.j@ucla.edu',
    avatar: null,
    apps: [{
      id: 'app-4',
      appName: 'GymBuddy',
      category: 'Fitness',
      rating: 4.0,
      ratingCount: 6,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.5, 0.8], 38),
      healthScore: 86,
      flags: [],
    }],
    joinedWeeksAgo: 2,
  },
  {
    id: '5',
    name: 'Aisha Okafor',
    email: 'aisha.o@columbia.edu',
    avatar: null,
    apps: [{
      id: 'app-5',
      appName: 'NoteSwap',
      category: 'Education',
      rating: 4.6,
      ratingCount: 16,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0.5, 0.75, 1.0], 94),
      healthScore: 93,
      flags: [],
    }],
    joinedWeeksAgo: 3,
  },
  {
    id: '6',
    name: 'Tyler Kim',
    email: 'tyler.k@nyu.edu',
    avatar: null,
    apps: [{
      id: 'app-6',
      appName: 'PartyRadar',
      category: 'Social',
      rating: 3.2,
      ratingCount: 5,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.9, 0.4], 30),
      healthScore: 58,
      flags: ['high_bounce_rate'],
    }],
    joinedWeeksAgo: 2,
  },
  {
    id: '7',
    name: 'Emma Rodriguez',
    email: 'emma.r@umich.edu',
    avatar: null,
    apps: [{
      id: 'app-7',
      appName: 'CampusConfessions',
      category: 'Social',
      rating: 4.3,
      ratingCount: 9,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.6, 1.0], 47),
      healthScore: 84,
      flags: [],
    }],
    joinedWeeksAgo: 2,
  },
  {
    id: '8',
    name: 'Sam Fisher',
    email: 'sam.f@cornell.edu',
    avatar: null,
    apps: [{
      id: 'app-8',
      appName: 'ParkingSpot',
      category: 'Utility',
      rating: 0,
      ratingCount: 0,
      weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0, 1.0], 12),
      healthScore: 70,
      flags: [],
    }],
    joinedWeeksAgo: 1,
  },
  {
    id: '9',
    name: 'David Chikly',
    email: 'david@airfold.co',
    avatar: null,
    apps: [
      {
        id: 'app-9a',
        appName: 'SecretCrush',
        category: 'Social',
        rating: 4.7,
        ratingCount: 19,
        weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.6, 1.0], 78),
        healthScore: 94,
        flags: [],
      },
      {
        id: 'app-9b',
        appName: 'CampusVibes',
        category: 'Social',
        rating: 4.1,
        ratingCount: 7,
        weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.5, 1.0], 42),
        healthScore: 87,
        flags: [],
      },
      {
        id: 'app-9c',
        appName: 'StudyBuddy AI',
        category: 'Education',
        rating: 4.4,
        ratingCount: 12,
        weeklyQAU: generateWeeklyData([0, 0, 0, 0, 0, 0, 0.4, 1.0], 25),
        healthScore: 90,
        flags: [],
      },
    ],
    joinedWeeksAgo: 1,
  },
];

/** The current logged-in creator for demo purposes */
export let currentCreatorId = '9';

export function getCreator(id: string): Creator | undefined {
  return creators.find(c => c.id === id);
}

export function getCurrentCreator(): Creator {
  return creators.find(c => c.id === currentCreatorId)!;
}

/** Sum QAU across all apps per week (element-wise) */
export function getCreatorTotalQAU(creator: Creator): number[] {
  if (creator.apps.length === 0) return Array(8).fill(0);
  return creator.apps[0].weeklyQAU.map((_, weekIdx) =>
    creator.apps.reduce((sum, app) => sum + app.weeklyQAU[weekIdx], 0)
  );
}

/** Weighted average health score (weighted by current week QAU) */
export function getCreatorAvgHealthScore(creator: Creator): number {
  const totalQAU = creator.apps.reduce((sum, app) => sum + app.weeklyQAU[7], 0);
  if (totalQAU === 0) return creator.apps.length > 0 ? Math.round(creator.apps.reduce((s, a) => s + a.healthScore, 0) / creator.apps.length) : 0;
  return Math.round(
    creator.apps.reduce((sum, app) => sum + app.healthScore * app.weeklyQAU[7], 0) / totalQAU
  );
}

/** Platform-wide stats — early stage, just launched */
export const platformStats = {
  totalCreators: 9,
  totalAppsLive: 10,
  totalQAUThisWeek: 490,
  totalPaidOut: 2000,
};
