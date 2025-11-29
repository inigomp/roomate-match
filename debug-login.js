import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogin() {
    const email = 'host1@test.com'
    const password = 'password123'

    console.log(`Attempting login for ${email}...`)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error('❌ Login Failed:', error.message)
        console.error('Error Status:', error.status)
    } else {
        console.log('✅ Login Successful!')
        console.log('User ID:', data.user.id)
        console.log('Email Confirmed At:', data.user.email_confirmed_at)
    }
}

debugLogin()
