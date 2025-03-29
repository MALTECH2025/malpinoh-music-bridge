
export enum ReleaseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  userId: string;
  status: ReleaseStatus;
  coverArt: string;
  audioFile: string;
  genre: string;
  releaseDate: string;
  createdAt: string;
  upc?: string;
  isrc?: string;
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
