
// Mock data for development and testing

import { 
  Release, 
  ReleaseStatus, 
  Earning, 
  Withdrawal,
  AuthUser,
  BlogPost,
  BlogTag
} from '@/types';

// Mock releases
export const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist_id: '123',
    artist: 'John Doe',
    release_date: '2023-06-01',
    platforms: ['Spotify', 'Apple Music'],
    status: ReleaseStatus.APPROVED,
    coverArt: 'https://picsum.photos/200',
    createdAt: '2023-05-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Winter Dreams',
    artist_id: '123',
    artist: 'John Doe',
    release_date: '2023-12-01',
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    status: ReleaseStatus.PENDING,
    coverArt: 'https://picsum.photos/200',
    createdAt: '2023-11-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Autumn Leaves',
    artist_id: '123',
    artist: 'John Doe',
    release_date: '2023-09-01',
    platforms: ['Spotify'],
    status: ReleaseStatus.REJECTED,
    coverArt: 'https://picsum.photos/200',
    createdAt: '2023-08-01T00:00:00.000Z',
    rejectionReason: 'Cover art resolution too low',
  },
];

// Mock earnings
export const mockEarnings: Earning[] = [
  {
    id: '1',
    artist_id: '123', // Changed from userId to artist_id
    amount: 120.50,
    date: '2023-06-15T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: '2',
    artist_id: '123', // Changed from userId to artist_id
    amount: 85.25,
    date: '2023-07-15T00:00:00.000Z',
    status: 'Pending',
  },
];

// Mock withdrawals
export const mockWithdrawals: Withdrawal[] = [
  {
    id: '1',
    userId: '123',
    amount: 100,
    status: 'APPROVED',
    createdAt: '2023-06-20T00:00:00.000Z',
    processedAt: '2023-06-22T00:00:00.000Z',
    accountName: 'John Doe',
    accountNumber: '123456789',
  },
  {
    id: '2',
    userId: '123',
    amount: 50,
    status: 'PENDING',
    createdAt: '2023-07-20T00:00:00.000Z',
    accountName: 'John Doe',
    accountNumber: '123456789',
  },
];

// Mock user
export const mockUser: AuthUser = {
  id: '123',
  email: 'john.doe@example.com',
  name: 'John Doe',
};

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tips for New Artists',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>',
    author_id: '123',
    published: true,
    created_at: '2023-05-01T00:00:00.000Z',
    updated_at: '2023-05-01T00:00:00.000Z',
    cover_image_url: 'https://picsum.photos/800/400',
    author_name: 'John Doe'
  },
  {
    id: '2',
    title: 'Music Distribution Strategies',
    content: '<p>Vestibulum ante ipsum primis in faucibus orci luctus...</p>',
    author_id: '123',
    published: true,
    created_at: '2023-06-15T00:00:00.000Z',
    updated_at: '2023-06-15T00:00:00.000Z',
    cover_image_url: 'https://picsum.photos/800/400',
    audio_url: 'https://example.com/audio.mp3',
    author_name: 'John Doe'
  }
];

// Mock blog tags
export const mockBlogTags: BlogTag[] = [
  {
    id: '1',
    name: 'Music Tips',
  },
  {
    id: '2',
    name: 'Distribution',
  },
  {
    id: '3',
    name: 'Marketing',
  }
];
