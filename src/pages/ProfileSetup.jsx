import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Save, Camera, ChevronRight } from 'lucide-react'

export default function ProfileSetup() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState({
        full_name: '',
        role: 'seeker',
        bio: '',
        avatar_url: '',
        preferences: {
            smoker: false,
            pets: false,
            budget_min: 0,
            budget_max: 1000,
        }
    })
    const [listing, setListing] = useState({
        title: '',
        description: '',
        price: 0,
        location: '',
        features: {
            wifi: true,
            ac: false,
            furnished: false
        },
        rules: {
            no_smoking: true,
            no_pets: true
        }
    })

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            let { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                if (data.role === 'host') {
                    const { data: listingData } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('host_id', user.id)
                        .single()
                    if (listingData) setListing(listingData)
                }
            }
        } catch (error) {
            console.error('Error loading user data!', error.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile() {
        try {
            setLoading(true)
            const { user } = await supabase.auth.getUser()

            const updates = {
                id: user.id,
                ...profile,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('users').upsert(updates)
            if (error) throw error

            if (profile.role === 'host') {
                const listingUpdates = {
                    host_id: user.id,
                    ...listing,
                    updated_at: new Date(),
                }

                if (listing.id) listingUpdates.id = listing.id

                const { error: listingError } = await supabase.from('listings').upsert(listingUpdates)
                if (listingError) throw listingError
            }

            alert('Profile updated!')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-4 text-center text-[#FD267A]">Loading...</div>

    return (
        <div className="h-full overflow-y-auto bg-gray-50 pb-24">
            {/* Header Image Area */}
            <div className="relative h-64 bg-gray-200 flex items-center justify-center overflow-hidden group cursor-pointer">
                {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                        <Camera size={40} />
                        <span className="text-sm mt-2">Add Photo</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-bold border-2 border-white px-4 py-1 rounded-full">EDIT</span>
                </div>
            </div>

            <div className="p-4 -mt-6 relative z-10">
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

                    {/* Name & Bio */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Name</label>
                            <input
                                type="text"
                                value={profile.full_name || ''}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full text-2xl font-bold text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2 transition placeholder-gray-300"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">About Me</label>
                            <textarea
                                value={profile.bio || ''}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full text-gray-600 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2 transition resize-none placeholder-gray-300"
                                rows={3}
                                placeholder="I like hiking and..."
                            />
                        </div>
                    </div>

                    {/* Role Toggle */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">I am...</label>
                        <div className="flex bg-gray-100 p-1 rounded-full">
                            <button
                                onClick={() => setProfile({ ...profile, role: 'seeker' })}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition ${profile.role === 'seeker' ? 'bg-white text-[#FD267A] shadow-md' : 'text-gray-400'
                                    }`}
                            >
                                Looking for a Room
                            </button>
                            <button
                                onClick={() => setProfile({ ...profile, role: 'host' })}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition ${profile.role === 'host' ? 'bg-white text-[#FD267A] shadow-md' : 'text-gray-400'
                                    }`}
                            >
                                Have a Room
                            </button>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">My Lifestyle</label>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-700 font-medium">Smoker</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={profile.preferences?.smoker || false} onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, smoker: e.target.checked } })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FD267A]"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-700 font-medium">Have Pets</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={profile.preferences?.pets || false} onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, pets: e.target.checked } })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FD267A]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Host Specific */}
                    {profile.role === 'host' && (
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <h3 className="text-[#FD267A] font-bold uppercase tracking-wider text-sm">Room Details</h3>
                            <div>
                                <input
                                    type="text"
                                    value={listing.title || ''}
                                    onChange={(e) => setListing({ ...listing, title: e.target.value })}
                                    className="w-full font-bold text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                    placeholder="Listing Title"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={listing.price || ''}
                                        onChange={(e) => setListing({ ...listing, price: e.target.value })}
                                        className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                        placeholder="Price $$"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={listing.location || ''}
                                        onChange={(e) => setListing({ ...listing, location: e.target.value })}
                                        className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Changes are saved automatically when you tap save.</p>
                </div>

                <button
                    onClick={updateProfile}
                    className="w-full mt-4 tinder-gradient text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition transform active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    Save Profile
                </button>
            </div>
        </div>
    )
}
