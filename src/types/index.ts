
// Project Types

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Release Types
export enum ReleaseStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}

export interface Release {
  id: string;
  title: string;
  artist_id: string;
  release_date: string;
  platforms: string[];
  status: ReleaseStatus | string;
  cover_art_url?: string | null;
  audio_file_url?: string | null;
  upc?: string | null;
  isrc?: string | null;
  // Additional properties needed by components
  coverArt?: string | null;
  audioFile?: string | null;
  artist?: string;
  createdAt?: string;
  userId?: string;
  genre?: string;
  releaseDate?: string;
  rejectionReason?: string | null;
  additionalAudioFiles?: any[] | string | null;
}

export interface ReleaseFormValues {
  title: string;
  release_date: Date;
  platforms: string[];
  cover_art?: File;
  audio_file?: File;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  cover_image_url?: string | null;
  audio_url?: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags?: BlogTag[];
  author_name?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  created_at: string;
}

export interface BlogPostFormValues {
  title: string;
  content: string;
  cover_image?: File;
  audio_file?: File;
  published: boolean;
  tags: string[];
}

// Earnings Types
export interface Earning {
  id: string;
  amount: number;
  status: "Pending" | "Paid";
  date: string;
}

// Withdrawal Types
export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  processedAt?: string;
  accountName: string;
  accountNumber: string;
}

export interface WithdrawalFormValues {
  amount: number;
  accountName: string;
  accountNumber: string;
}

// System Settings Types
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

// Form Values Types
export interface ResetPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Stats Types
export interface DashboardStats {
  totalReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  rejectedReleases: number;
  totalEarnings: number;
  availableBalance: number;
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  pendingWithdrawals: number;
}
