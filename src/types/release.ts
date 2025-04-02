
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
