import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createHost() {
    const email = 'host_manual_123@example.com'
    const password = 'Test123!'

    console.log(`Creating host: ${email}`)

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    })

    if (authError) {
        console.error('Auth Error:', authError.message)
        // If user already exists, try to get ID? No, just exit.
        if (!authError.message.includes('already registered')) return
    }

    const userId = authData.user?.id
    if (!userId) {
        console.log('User might already exist, trying to login to get ID...')
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (loginError) {
            console.error('Login Error:', loginError.message)
            return
        }
        // If login works, check profile
        const id = loginData.user.id
        await createProfile(id, email)
        return
    }

    await createProfile(userId, email)
}

async function createProfile(userId, email) {
    // 2. Create Profile
    const { error: profileError } = await supabase.from('users').upsert({
        id: userId,
        email: email,
        full_name: 'Host Madrid Manual',
        role: 'host',
        bio: 'Manual host account for testing',
        preferences: {}
    })

    if (profileError) {
        console.error('Profile Error:', profileError.message)
    } else {
        console.log('✅ Host profile created!')
    }

    // 3. Create Listing
    const { error: listingError } = await supabase.from('listings').insert({
        host_id: userId,
        title: 'Habitación Manual en Sol',
        description: 'Habitación de prueba creada manualmente',
        price: 500,
        address: 'Puerta del Sol, Madrid',
        latitude: 40.4169,
        longitude: -3.7035,
        location: 'Sol',
        available_from: new Date().toISOString().split('T')[0],
        min_stay_months: 6,
        features: { size_m2: 15, wifi: true },
        rules: { smoking_allowed: false }
    })

    if (listingError) {
        console.error('Listing Error:', listingError.message)
    } else {
        console.log('✅ Listing created!')
    }
}

createHost()
