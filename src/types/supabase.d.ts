
// This file adds custom type augmentations to make TypeScript understand our database schema

// We're not importing Database directly to avoid conflicts with the auto-generated types
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from '@supabase/supabase-js';

// Instead of declaring a duplicate Database type, we'll augment the existing one
declare module '@supabase/supabase-js' {
  // Use interface augmentation for the SupabaseClient
  interface SupabaseClient {
    // Use string index signatures to allow any table name without needing to import Database
    from<T extends string>(
      table: T
    ): PostgrestQueryBuilder<any>;
    
    rpc<T extends string>(
      fn: T,
      params?: Record<string, unknown>
    ): PostgrestFilterBuilder<any>;
  }
}
