
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
  rich_content?: any | null; // This field now exists in the database
  tags?: BlogTag[];
  author_name?: string;
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
  rich_content?: any;
  media_files?: File[];
}

// Referencing types from database, but not re-exporting Database to avoid duplication
export type Tables = any;
export type BlogPostRow = any;
export type BlogTagRow = any;
export type BlogPostTagRow = any;
