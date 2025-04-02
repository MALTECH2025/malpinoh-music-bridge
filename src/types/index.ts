
// Project Types

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Release Types
export interface Release {
  id: string;
  title: string;
  artist_id: string;
  release_date: string;
  platforms: string[];
  status: "Pending" | "Approved" | "Rejected";
  cover_art_url?: string | null;
  audio_file_url?: string | null;
  upc?: string | null;
  isrc?: string | null;
}

export interface ReleaseFormValues {
  title: string;
  release_date: Date;
  platforms: string[];
  cover_art?: File;
  audio_file?: File;
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
