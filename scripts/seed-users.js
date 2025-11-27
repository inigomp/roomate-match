import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zouwkgggkttuljdayxrp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdXdrZ2dna3R0dWxqZGF5eHJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTI2NywiZXhwIjoyMDc5NzUxMjY3fQ.b-tF3oLfXDTlq0M06mRKWn-Rlu2YruhaGHPAib9uCF8'
const supabase = createClient(supabaseUrl, supabaseKey)

const hosts = [
    {
        email: 'host1@test.com',
        password: 'password123',
        full_name: 'Sarah Jenkins',
        role: 'host',
        bio: 'Chill graphic designer looking for a tidy roommate.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: true },
        listing: {
            title: 'Sunny Room in Mission District',
            description: 'Beautiful light-filled room with bay windows. Close to BART and great coffee shops.',
            price: 1200,
            location: 'San Francisco, CA',
            features: { wifi: true, ac: false, furnished: true },
            rules: { no_smoking: true, no_pets: false },
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
        }
    },
    {
        email: 'host2@test.com',
        password: 'password123',
        full_name: 'Mike Chen',
        role: 'host',
        bio: 'Tech worker, love hiking and gaming.',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: false },
        listing: {
            title: 'Modern Loft Downtown',
            description: 'High ceilings, exposed brick, very modern. Private bath included.',
            price: 1800,
            location: 'Seattle, WA',
            features: { wifi: true, ac: true, furnished: false },
            rules: { no_smoking: true, no_pets: true },
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
        }
    },
    {
        email: 'host3@test.com',
        password: 'password123',
        full_name: 'Elena Rodriguez',
        role: 'host',
        bio: 'Nurse working night shifts. Quiet home.',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: true },
        listing: {
            title: 'Cozy Bedroom in Queens',
            description: 'Small but cozy room. Shared kitchen and living room. Cat friendly!',
            price: 900,
            location: 'New York, NY',
            features: { wifi: true, ac: true, furnished: true },
            rules: { no_smoking: true, no_pets: false },
            images: ['https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
        }
    },
    {
        email: 'host4@test.com',
        password: 'password123',
        full_name: 'David Kim',
        role: 'host',
        bio: 'Musician and teacher. Love cooking.',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: true, pets: false },
        listing: {
            title: 'Large Room in Shared House',
            description: 'Big backyard, music studio in garage. Social household.',
            price: 750,
            location: 'Austin, TX',
            features: { wifi: true, ac: true, furnished: false },
            rules: { no_smoking: false, no_pets: true },
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
        }
    }
]

const seekers = [
    {
        email: 'seeker1@test.com',
        password: 'password123',
        full_name: 'Jessica Lee',
        role: 'seeker',
        bio: 'Student looking for a quiet place to study.',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: false, budget_min: 500, budget_max: 1000 }
    },
    {
        email: 'seeker2@test.com',
        password: 'password123',
        full_name: 'Tom Wilson',
        role: 'seeker',
        bio: 'New in town, working in finance. Clean and organized.',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: false, budget_min: 1500, budget_max: 2500 }
    },
    {
        email: 'seeker3@test.com',
        password: 'password123',
        full_name: 'Amanda Smith',
        role: 'seeker',
        bio: 'Artist and dog lover. I come with a golden retriever!',
        avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: true, budget_min: 800, budget_max: 1200 }
    },
    {
        email: 'seeker4@test.com',
        password: 'password123',
        full_name: 'Chris Martin',
        role: 'seeker',
        bio: 'Barista and writer. Easy going.',
        avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: true, pets: false, budget_min: 600, budget_max: 900 }
    },
    {
        email: 'seeker5@test.com',
        password: 'password123',
        full_name: 'Sophie Turner',
        role: 'seeker',
        bio: 'Digital nomad looking for a base for 6 months.',
        avatar_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: false, budget_min: 1000, budget_max: 1500 }
    },
    {
        email: 'seeker6@test.com',
        password: 'password123',
        full_name: 'James O\'Connor',
        role: 'seeker',
        bio: 'Chef. I cook great meals for my roommates!',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: true, budget_min: 1200, budget_max: 1800 }
    },
    {
        email: 'seeker7@test.com',
        password: 'password123',
        full_name: 'Linda Wong',
        role: 'seeker',
        bio: 'Grad student. Quiet and respectful.',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: false, pets: false, budget_min: 700, budget_max: 1000 }
    },
    {
        email: 'seeker8@test.com',
        password: 'password123',
        full_name: 'Robert Brown',
        role: 'seeker',
        bio: 'Construction worker. Early riser.',
        avatar_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        preferences: { smoker: true, pets: true, budget_min: 800, budget_max: 1100 }
    }
]

async function seed() {
    console.log('Starting seed...')

    const allUsers = [...hosts, ...seekers]

    for (const u of allUsers) {
        console.log(`Creating user: ${u.email}`)

        // 1. Create User (Admin)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true
        })

        if (authError) {
            console.error(`Error creating auth for ${u.email}:`, authError.message)
            // If user already exists, we might want to continue to update profile?
            // But we don't have the ID if we don't get it back.
            // We could try to signIn to get the ID, but let's just skip for now.
            continue
        }

        const userId = authData.user.id

        // 2. Insert Profile
        const { error: profileError } = await supabase.from('users').upsert({
            id: userId,
            email: u.email,
            full_name: u.full_name,
            avatar_url: u.avatar_url,
            role: u.role,
            bio: u.bio,
            preferences: u.preferences
        })

        if (profileError) {
            console.error(`Error creating profile for ${u.email}:`, profileError.message)
        }

        // 3. Insert Listing if Host
        if (u.role === 'host' && u.listing) {
            const { error: listingError } = await supabase.from('listings').insert({
                host_id: userId,
                ...u.listing
            })

            if (listingError) {
                console.error(`Error creating listing for ${u.email}:`, listingError.message)
            }
        }
    }

    console.log('Seed complete!')
}

seed()
