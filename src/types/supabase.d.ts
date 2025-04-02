
// This file adds custom type augmentations to make TypeScript understand our database schema

// Note: We're not importing Database directly to avoid duplicate identifier issues
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from '@supabase/supabase-js';

// Augment the Supabase client types
declare module '@supabase/supabase-js' {
  // Use a generic interface reference instead of importing Database directly
  interface SupabaseClient {
    from<T extends keyof Database['public']['Tables'] | 'withdrawals' | 'system_settings'>(
      table: T
    ): T extends keyof Database['public']['Tables'] 
      ? PostgrestQueryBuilder<Database['public']['Tables'][T]['Row']> 
      : PostgrestQueryBuilder<any>;
    
    rpc<T extends string>(
      fn: T,
      params?: Record<string, unknown>
    ): PostgrestFilterBuilder<any>;
  }
}

// Reference the global Database interface that's defined in the generated Supabase types
// without importing it directly, which would cause the duplicate identifier error
