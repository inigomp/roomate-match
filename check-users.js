import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
    console.log('Checking users table...')
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(10)

    if (error) {
        console.error('Error fetching users:', error.message)
    } else {
        console.log(`Found ${data.length} users in public table:`)
        console.log(data)
    }
}

checkUsers()
