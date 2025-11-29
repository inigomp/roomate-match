import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateHostLocation() {
    const email = 'host1@test.com'

    // 1. Get User ID
    const { data: { user }, error: userError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123'
    })

    if (userError) {
        console.error('Login failed:', userError.message)
        return
    }

    const userId = user.id
    console.log(`Updating location for ${email} (${userId})...`)

    // 2. Update Listing
    const { error: listingError } = await supabase
        .from('listings')
        .update({
            address: 'Gran Vía 1, Madrid, España',
            latitude: 40.4197,
            longitude: -3.6974,
            location: 'Centro'
        })
        .eq('host_id', userId)

    if (listingError) {
        console.error('Error updating listing:', listingError.message)
    } else {
        console.log('✅ Listing location updated to Madrid!')
    }

    // 3. Update Profile (optional, but good for consistency)
    // Note: Profile doesn't strictly store location for hosts in the same way, but good to check.
}

updateHostLocation()
