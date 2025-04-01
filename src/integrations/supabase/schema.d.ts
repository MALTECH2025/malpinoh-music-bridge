
import { Database } from './types';

// Extend Database with additional tables/fields that aren't in the auto-generated types
declare module './types' {
  interface Database {
    public: {
      Tables: {
        withdrawals: {
          Row: {
            id: string;
            user_id: string;
            artist_id: string;
            amount: number;
            status: string;
            account_name: string;
            account_number: string;
            created_at: string;
            processed_at: string | null;
          };
          Insert: {
            id?: string;
            user_id: string;
            artist_id: string;
            amount: number;
            status?: string;
            account_name: string;
            account_number: string;
            created_at?: string;
            processed_at?: string | null;
          };
          Update: {
            id?: string;
            user_id?: string;
            artist_id?: string;
            amount?: number;
            status?: string;
            account_name?: string;
            account_number?: string;
            created_at?: string;
            processed_at?: string | null;
          };
        };
        artists: {
          Row: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            created_at: string | null;
            wallet_balance: number | null;
            total_earnings: number | null;
            available_balance: number | null;
          };
          Insert: {
            id: string;
            name: string;
            email: string;
            phone?: string | null;
            created_at?: string | null;
            wallet_balance?: number | null;
            total_earnings?: number | null;
            available_balance?: number | null;
          };
          Update: {
            id?: string;
            name?: string;
            email?: string;
            phone?: string | null;
            created_at?: string | null;
            wallet_balance?: number | null;
            total_earnings?: number | null;
            available_balance?: number | null;
          };
        };
        releases: {
          Row: {
            id: string;
            title: string;
            artist_id: string;
            status: Database['public']['Enums']['release_status'];
            cover_art_url: string | null;
            audio_file_url: string | null;
            release_date: string;
            platforms: string[];
            upc: string | null;
            isrc: string | null;
          };
          Insert: {
            id?: string;
            title: string;
            artist_id: string;
            status?: Database['public']['Enums']['release_status'];
            cover_art_url?: string | null;
            audio_file_url?: string | null;
            release_date: string;
            platforms: string[];
            upc?: string | null;
            isrc?: string | null;
          };
          Update: {
            id?: string;
            title?: string;
            artist_id?: string;
            status?: Database['public']['Enums']['release_status'];
            cover_art_url?: string | null;
            audio_file_url?: string | null;
            release_date?: string;
            platforms?: string[];
            upc?: string | null;
            isrc?: string | null;
          };
        };
      };
    };
  }
}
