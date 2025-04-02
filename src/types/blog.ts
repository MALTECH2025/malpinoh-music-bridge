
import { Database } from "@/integrations/supabase/types";

// Blog post type with all required fields
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  cover_image_url?: string | null;
  audio_url?: string | null;
  tags?: BlogTag[];
  author_name?: string; // Added this field to fix the error in BlogPost.tsx
}

// Blog tag type
export interface BlogTag {
  id: string;
  name: string;
  created_at?: string;
}

// Blog post with tag relation
export interface BlogPostTag {
  post_id: string;
  tag_id: string;
  blog_tags?: BlogTag;
}

export interface BlogPostFormValues {
  title: string;
  content: string;
  cover_image?: File;
  audio_file?: File;
  published: boolean;
  tags: string[];
}

// Extend the types from the database to use in the application
export type Tables = Database['public']['Tables'];
export type BlogPostRow = Tables['blog_posts']['Row'];
export type BlogTagRow = Tables['blog_tags']['Row'];
export type BlogPostTagRow = Tables['blog_posts_tags']['Row'];
