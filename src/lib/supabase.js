import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zouwkgggkttuljdayxrp.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
