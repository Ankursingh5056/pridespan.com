import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(PROJECT_URL, ANON_KEY)
