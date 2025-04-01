
export enum ReleaseStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  userId?: string; // Make optional to handle data from Supabase
  status: ReleaseStatus | string; // Support string values coming from Supabase
  coverArt?: string | null; // Make optional and allow null
  audioFile?: string; // Make optional to handle data from Supabase
  genre?: string; // Make optional to handle data from Supabase
  releaseDate?: string; // Make optional to handle data from Supabase
  createdAt: string;
  upc?: string;
  isrc?: string;
  platforms?: string[]; // Add platforms field from Supabase
  rejectionReason?: string; // Add rejection reason field
  additionalAudioFiles?: any; // Add additional audio files support
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
  accountName: string;
  accountNumber: string;
}

// Ensure WithdrawalFormValues has all required fields (no optional fields)
export interface WithdrawalFormValues {
  amount: number;
  accountName: string;
  accountNumber: string;
}

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
