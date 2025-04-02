import { ReleaseStatus, Release, Withdrawal, Earning } from "@/types";

// Sample releases data
export const mockReleases: Release[] = [
  {
    id: "1",
    title: "Summer Vibes",
    artist: "DJ Rhythm",
    artist_id: "user-123",
    userId: "user-123",
    status: ReleaseStatus.APPROVED,
    coverArt: "/placeholder.svg",
    audioFile: "/placeholder.mp3",
    cover_art_url: "/placeholder.svg",
    audio_file_url: "/placeholder.mp3",
    genre: "Electronic",
    releaseDate: "2023-06-15",
    release_date: "2023-06-15",
    createdAt: "2023-05-10T12:00:00Z",
    upc: "123456789012",
    isrc: "USABC1234567",
    platforms: ["Spotify", "Apple Music", "YouTube Music"]
  },
  {
    id: "2",
    title: "Midnight Dreams",
    artist: "Luna Sky",
    artist_id: "user-123",
    userId: "user-123",
    status: ReleaseStatus.PENDING,
    coverArt: "/placeholder.svg",
    audioFile: "/placeholder.mp3", 
    cover_art_url: "/placeholder.svg",
    audio_file_url: "/placeholder.mp3",
    genre: "R&B",
    releaseDate: "2023-07-22",
    release_date: "2023-07-22",
    createdAt: "2023-06-10T10:30:00Z",
    platforms: ["Spotify", "Apple Music", "Deezer"]
  },
  {
    id: "3",
    title: "Urban Echoes",
    artist: "MC Flow",
    artist_id: "user-456",
    userId: "user-456",
    status: ReleaseStatus.REJECTED,
    coverArt: "/placeholder.svg",
    audioFile: "/placeholder.mp3",
    cover_art_url: "/placeholder.svg",
    audio_file_url: "/placeholder.mp3",
    genre: "Hip Hop",
    releaseDate: "2023-08-05",
    release_date: "2023-08-05", 
    createdAt: "2023-07-01T14:15:00Z",
    rejectionReason: "Poor audio quality",
    platforms: ["Spotify", "SoundCloud", "Tidal"]
  }
];

// Sample withdrawals data
export const mockWithdrawals: Withdrawal[] = [
  {
    id: "1",
    userId: "user-123",
    amount: 50,
    status: "APPROVED",
    createdAt: "2023-07-10",
    processedAt: "2023-07-12",
    accountName: "DJ Rhythm",
    accountNumber: "1234567890"
  },
  {
    id: "2",
    userId: "user-123",
    amount: 70.5,
    status: "PENDING",
    createdAt: "2023-08-20",
    accountName: "Luna Sky",
    accountNumber: "1234567890"
  }
];

// Sample earnings data
export const mockEarnings: Earning[] = [
  {
    id: "1",
    userId: "user-123",
    amount: 120.50,
    createdAt: "2023-06-15",
    accountName: "DJ Rhythm",
    accountNumber: "1234567890"
  },
  {
    id: "2",
    userId: "user-123",
    amount: 80.00,
    createdAt: "2023-07-22",
    accountName: "Luna Sky",
    accountNumber: "1234567890"
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
