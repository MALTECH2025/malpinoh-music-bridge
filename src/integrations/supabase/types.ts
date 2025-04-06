export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          available_balance: number | null
          ban_reason: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          status: string | null
          total_earnings: number | null
          wallet_balance: number | null
        }
        Insert: {
          available_balance?: number | null
          ban_reason?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          status?: string | null
          total_earnings?: number | null
          wallet_balance?: number | null
        }
        Update: {
          available_balance?: number | null
          ban_reason?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          total_earnings?: number | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          audio_url: string | null
          author_id: string
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          rich_content: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          author_id: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          rich_content?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          author_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          rich_content?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          artist_id: string
          date: string
          id: string
          status: Database["public"]["Enums"]["earnings_status"]
        }
        Insert: {
          amount: number
          artist_id: string
          date?: string
          id?: string
          status?: Database["public"]["Enums"]["earnings_status"]
        }
        Update: {
          amount?: number
          artist_id?: string
          date?: string
          id?: string
          status?: Database["public"]["Enums"]["earnings_status"]
        }
        Relationships: [
          {
            foreignKeyName: "earnings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      releases: {
        Row: {
          artist_id: string
          audio_file_url: string | null
          cover_art_url: string | null
          id: string
          isrc: string | null
          platforms: string[]
          release_date: string
          status: Database["public"]["Enums"]["release_status"]
          title: string
          upc: string | null
        }
        Insert: {
          artist_id: string
          audio_file_url?: string | null
          cover_art_url?: string | null
          id?: string
          isrc?: string | null
          platforms: string[]
          release_date: string
          status?: Database["public"]["Enums"]["release_status"]
          title: string
          upc?: string | null
        }
        Update: {
          artist_id?: string
          audio_file_url?: string | null
          cover_art_url?: string | null
          id?: string
          isrc?: string | null
          platforms?: string[]
          release_date?: string
          status?: Database["public"]["Enums"]["release_status"]
          title?: string
          upc?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_name: string
          account_number: string
          amount: number
          artist_id: string
          created_at: string
          id: string
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          amount: number
          artist_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          amount?: number
          artist_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role:
        | {
            Args: {
              role_name: string
            }
            Returns: boolean
          }
        | {
            Args: {
              user_id: string
              role: Database["public"]["Enums"]["user_role"]
            }
            Returns: boolean
          }
    }
    Enums: {
      earnings_status: "Pending" | "Paid"
      release_status: "Pending" | "Approved" | "Rejected"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
