export type ProgramTag = "GAMOT" | "Malasakit" | "PhilHealth" | "GL" | "Hospital";

export type FilterChip =
  | "All"
  | "Medicine"
  | "Health Center"
  | "Pharmacy"
  | "Government Support"
  | "Question"
  | "Success Story";

export type AvailabilityStatus = "Available" | "Low Stock" | "Out of Stock";

export type BadgeTier = "Gold" | "Silver" | "Bronze";

export type CommunityPost = {
  id: string;
  username: string;
  region: string;
  postedAt: string;
  programs: ProgramTag[];
  medicine: string;
  content: string;
  image?: string;
  waitingTime: string;
  cost: string;
  documents: string[];
  healthCenter?: string;
  pharmacy?: string;
  likes: number;
  comments: number;
  category: FilterChip;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  region: string;
  points: number;
  helpfulPosts: number;
  verifiedReports: number;
  badge: BadgeTier;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  tags: ProgramTag[];
  author: string;
  region: string;
  postedAt: string;
  answers: number;
  hasBestAnswer?: boolean;
};

export type Comment = {
  id: string;
  author: string;
  content: string;
  postedAt: string;
  helpful: number;
};
