import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://tndgcypaguwxeizryfoj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZGdjeXBhZ3V3eGVpenJ5Zm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzYwMDMsImV4cCI6MjA2NTk1MjAwM30.bcaJXkjYtXJefotEf-k4hmdDa3IKGsdMFswHA8wzLHs"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Admin-specific client with service role key (for server-side operations)
// This should be used carefully and only for admin operations
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) 