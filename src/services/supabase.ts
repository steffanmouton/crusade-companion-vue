import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Export the client for use in other files
export default supabase
