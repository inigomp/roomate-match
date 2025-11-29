import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugPreferences() {
    const email = 'seeker1@test.com'
    const password = 'password123'

    console.log(`Logging in as ${email}...`)
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (loginError) {
        console.error('Login failed:', loginError.message)
        return
    }

    console.log('Current preferences:')
    const { data: profile } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', user.id)
        .single()

    console.log(JSON.stringify(profile.preferences, null, 2))

    console.log('\nUpdating budget_max to 2000...')
    const newPreferences = {
        ...profile.preferences,
        budget_max: 2000
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({ preferences: newPreferences })
        .eq('id', user.id)

    if (updateError) {
        console.error('Update failed:', updateError.message)
    } else {
        console.log('Update successful!')
    }

    console.log('\nVerifying update...')
    const { data: updatedProfile } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', user.id)
        .single()

    console.log(JSON.stringify(updatedProfile.preferences, null, 2))
}

debugPreferences()
