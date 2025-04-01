
// This file adds custom type augmentations to make TypeScript understand our database schema

import { Database } from "@/integrations/supabase/types";

// Augment the Supabase client types
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from<T extends keyof Database['public']['Tables'] | 'withdrawals'>(
      table: T
    ): T extends keyof Database['public']['Tables'] 
      ? PostgrestQueryBuilder<Database['public']['Tables'][T]['Row']> 
      : PostgrestQueryBuilder<any>;
  }
}
