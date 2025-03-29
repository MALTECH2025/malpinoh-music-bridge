
import { Release, ReleaseStatus, Withdrawal } from '@/types';

// Mock releases data
export const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Demo Artist',
    userId: '2',
    status: ReleaseStatus.APPROVED,
    coverArt: 'https://via.placeholder.com/300',
    audioFile: 'summer-vibes.mp3',
    genre: 'Pop',
    releaseDate: '2023-07-15',
    createdAt: '2023-06-01',
    upc: '123456789012',
    isrc: 'USABC1234567'
  },
  {
    id: '2',
    title: 'Night Dreams',
    artist: 'Demo Artist',
    userId: '2',
    status: ReleaseStatus.PENDING,
    coverArt: 'https://via.placeholder.com/300',
    audioFile: 'night-dreams.mp3',
    genre: 'R&B',
    releaseDate: '2023-09-20',
    createdAt: '2023-08-15'
  },
  {
    id: '3',
    title: 'Urban Stories',
    artist: 'Demo Artist',
    userId: '2',
    status: ReleaseStatus.REJECTED,
    coverArt: 'https://via.placeholder.com/300',
    audioFile: 'urban-stories.mp3',
    genre: 'Hip-Hop',
    releaseDate: '2023-05-10',
    createdAt: '2023-04-01'
  }
];

// Mock withdrawals data
export const mockWithdrawals: Withdrawal[] = [
  {
    id: '1',
    userId: '2',
    amount: 50,
    status: 'APPROVED',
    createdAt: '2023-07-10',
    processedAt: '2023-07-12',
    accountName: 'Demo Artist',
    accountNumber: '1234567890'
  },
  {
    id: '2',
    userId: '2',
    amount: 70.5,
    status: 'PENDING',
    createdAt: '2023-08-20',
    accountName: 'Demo Artist',
    accountNumber: '1234567890'
  }
];

export const getReleasesForUser = (userId: string): Release[] => {
  return mockReleases.filter(release => release.userId === userId);
};

export const getWithdrawalsForUser = (userId: string): Withdrawal[] => {
  return mockWithdrawals.filter(withdrawal => withdrawal.userId === userId);
};

export const getDashboardStats = (userId: string) => {
  const userReleases = getReleasesForUser(userId);
  const totalReleases = userReleases.length;
  const pendingReleases = userReleases.filter(r => r.status === ReleaseStatus.PENDING).length;
  const approvedReleases = userReleases.filter(r => r.status === ReleaseStatus.APPROVED).length;
  const rejectedReleases = userReleases.filter(r => r.status === ReleaseStatus.REJECTED).length;
  
  // Mock earnings calculation
  const totalEarnings = 120.50; // In a real app, this would be calculated based on streams, etc.
  const withdrawnAmount = mockWithdrawals
    .filter(w => w.userId === userId && w.status === 'APPROVED')
    .reduce((sum, w) => sum + w.amount, 0);
    
  const availableBalance = totalEarnings - withdrawnAmount;
  
  return {
    totalReleases,
    pendingReleases,
    approvedReleases,
    rejectedReleases,
    totalEarnings,
    availableBalance
  };
};

export const getAdminStats = () => {
  const totalUsers = 2; // Mock data
  const totalReleases = mockReleases.length;
  const pendingReleases = mockReleases.filter(r => r.status === ReleaseStatus.PENDING).length;
  const approvedReleases = mockReleases.filter(r => r.status === ReleaseStatus.APPROVED).length;
  const rejectedReleases = mockReleases.filter(r => r.status === ReleaseStatus.REJECTED).length;
  const pendingWithdrawals = mockWithdrawals.filter(w => w.status === 'PENDING').length;
  
  return {
    totalUsers,
    totalReleases,
    pendingReleases,
    approvedReleases,
    rejectedReleases,
    totalEarnings: 0, // Admin doesn't have earnings
    availableBalance: 0, // Admin doesn't have balance
    pendingWithdrawals
  };
};
