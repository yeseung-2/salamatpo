import type { CommunityPost, LeaderboardEntry, Question } from "./types";

export const FILTER_CHIPS = [
  "All",
  "Medicine",
  "Health Center",
  "Pharmacy",
  "Government Support",
  "Question",
  "Success Story",
] as const;

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "1",
    username: "Maria Santos",
    region: "Quezon City",
    postedAt: "2 hours ago",
    programs: ["GAMOT", "PhilHealth"],
    medicine: "Metformin",
    content:
      "I successfully received free medicine today at TGP Pharmacy. Staff was very helpful and the process was smooth.",
    waitingTime: "30 min",
    cost: "₱0",
    documents: ["PhilHealth ID", "Prescription"],
    pharmacy: "TGP Pharmacy",
    healthCenter: "Quezon City Health Center",
    likes: 24,
    comments: 8,
    category: "Success Story",
  },
  {
    id: "2",
    username: "Juan Dela Cruz",
    region: "Manila",
    postedAt: "5 hours ago",
    programs: ["Malasakit", "PhilHealth"],
    medicine: "Losartan",
    content:
      "PhilHealth desk at Manila City Hospital processed my request quickly. Bring your senior card if applicable.",
    waitingTime: "45 min",
    cost: "₱0",
    documents: ["PhilHealth ID", "Prescription", "Senior Card"],
    pharmacy: "Mercury Drug - Taft",
    healthCenter: "Manila City Hospital",
    likes: 18,
    comments: 5,
    category: "Government Support",
  },
  {
    id: "3",
    username: "Ana Reyes",
    region: "Pasig City",
    postedAt: "1 day ago",
    programs: ["GAMOT"],
    medicine: "Amlodipine",
    content:
      "Stock available at Pasig Health Center as of today. Low waiting time in the morning before 10 AM.",
    waitingTime: "15 min",
    cost: "₱0",
    documents: ["Barangay Certificate", "Prescription"],
    healthCenter: "Pasig City Health Center",
    likes: 42,
    comments: 12,
    category: "Health Center",
  },
];

export const LEADERBOARD_WEEKLY: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Maria Santos",
    region: "Quezon City",
    points: 1240,
    helpfulPosts: 18,
    verifiedReports: 12,
    badge: "Gold",
  },
  {
    rank: 2,
    username: "Juan Dela Cruz",
    region: "Manila",
    points: 980,
    helpfulPosts: 14,
    verifiedReports: 9,
    badge: "Silver",
  },
  {
    rank: 3,
    username: "Ana Reyes",
    region: "Pasig City",
    points: 760,
    helpfulPosts: 11,
    verifiedReports: 7,
    badge: "Bronze",
  },
  {
    rank: 4,
    username: "Pedro Garcia",
    region: "Makati",
    points: 540,
    helpfulPosts: 8,
    verifiedReports: 5,
    badge: "Bronze",
  },
];

export const LEADERBOARD_MONTHLY: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Ana Reyes",
    region: "Pasig City",
    points: 4820,
    helpfulPosts: 52,
    verifiedReports: 38,
    badge: "Gold",
  },
  {
    rank: 2,
    username: "Maria Santos",
    region: "Quezon City",
    points: 4150,
    helpfulPosts: 47,
    verifiedReports: 31,
    badge: "Silver",
  },
  {
    rank: 3,
    username: "Juan Dela Cruz",
    region: "Manila",
    points: 3890,
    helpfulPosts: 41,
    verifiedReports: 28,
    badge: "Bronze",
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Can I receive free medicine without PhilHealth?",
    body: "I don't have PhilHealth yet but I have a barangay certificate. Is GAMOT still available for me?",
    tags: ["PhilHealth", "GAMOT"],
    author: "Carlos M.",
    region: "Taguig",
    postedAt: "3 hours ago",
    answers: 4,
    hasBestAnswer: true,
  },
  {
    id: "q2",
    title: "How long is the wait at Malasakit centers?",
    body: "Planning to visit PGH Malasakit center this week. What documents should I prepare?",
    tags: ["Malasakit", "Hospital"],
    author: "Lisa T.",
    region: "Manila",
    postedAt: "6 hours ago",
    answers: 2,
  },
  {
    id: "q3",
    title: "Metformin stock at Quezon City health centers?",
    body: "Has anyone checked Metformin availability this week? My usual center ran out last month.",
    tags: ["GAMOT"],
    author: "Roberto P.",
    region: "Quezon City",
    postedAt: "1 day ago",
    answers: 7,
    hasBestAnswer: true,
  },
];

export function getPostById(id: string): CommunityPost | undefined {
  return COMMUNITY_POSTS.find((post) => post.id === id);
}
