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
            pets: 'no',
            budget_min: 0,
            budget_max: 1000,
            move_in_date: '',
            occupation: 'student',
        }
    })
    const [listing, setListing] = useState({
        title: '',
        description: '',
        price: 0,
        location: '',
        available_from: '',
        min_stay_months: 1,
        features: {
            wifi: false,
            ac: false,
            furnished: false,
            heating: false,
            elevator: false,
            dishwasher: false,
            private_bath: false,
            size_m2: 0,
        },
        rules: {
            smoking_allowed: false,
            pets_allowed: 'no',
            visitors_allowed: 'yes',
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
                // Ensure preferences and listing features/rules are objects
                const userProfile = {
                    ...data,
                    preferences: data.preferences || {
                        smoker: false,
                        pets: 'no',
                        budget_min: 0,
                        budget_max: 1000,
                        move_in_date: '',
                        occupation: 'student',
                    }
                }
                setProfile(userProfile)
                if (data.role === 'host') {
                    const { data: listingData } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('host_id', user.id)
                        .single()
                    if (listingData) {
                        setListing({
                            ...listingData,
                            features: listingData.features || {
                                wifi: false, ac: false, furnished: false, heating: false,
                                elevator: false, dishwasher: false, private_bath: false, size_m2: 0
                            },
                            rules: listingData.rules || {
                                smoking_allowed: false, pets_allowed: 'no', visitors_allowed: 'yes'
                            }
                        })
                    }
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
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-8">

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

                    {/* HOST FORM */}
                    {profile.role === 'host' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-[#FD267A] font-bold uppercase tracking-wider text-sm mb-4">The Room</h3>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={listing.title || ''}
                                        onChange={(e) => setListing({ ...listing, title: e.target.value })}
                                        className="w-full font-bold text-lg text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                        placeholder="Listing Title (e.g. Sunny Room in Mission)"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Price / Month</label>
                                            <input
                                                type="number"
                                                value={listing.price || ''}
                                                onChange={(e) => setListing({ ...listing, price: parseInt(e.target.value) })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                                placeholder="$$$"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Room Size (m²)</label>
                                            <input
                                                type="number"
                                                value={listing.features?.size_m2 || ''}
                                                onChange={(e) => setListing({ ...listing, features: { ...listing.features, size_m2: parseInt(e.target.value) } })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                                placeholder="e.g. 12"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Available From</label>
                                            <input
                                                type="date"
                                                value={listing.available_from || ''}
                                                onChange={(e) => setListing({ ...listing, available_from: e.target.value })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Min Stay (Months)</label>
                                            <input
                                                type="number"
                                                value={listing.min_stay_months || 1}
                                                onChange={(e) => setListing({ ...listing, min_stay_months: parseInt(e.target.value) })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-[#FD267A] font-bold uppercase tracking-wider text-sm mb-4">Features & Rules</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-2">Amenities</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Wifi', 'AC', 'Heating', 'Elevator', 'Dishwasher', 'Private Bath', 'Furnished'].map(item => {
                                                const key = item.toLowerCase().replace(' ', '_')
                                                const active = listing.features?.[key]
                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => setListing({
                                                            ...listing,
                                                            features: { ...listing.features, [key]: !active }
                                                        })}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${active
                                                            ? 'bg-[#FD267A] text-white border-[#FD267A]'
                                                            : 'bg-white text-gray-500 border-gray-200'
                                                            }`}
                                                    >
                                                        {item}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-2">House Rules</label>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Smoking Allowed</span>
                                                <input
                                                    type="checkbox"
                                                    checked={listing.rules?.smoking_allowed || false}
                                                    onChange={(e) => setListing({ ...listing, rules: { ...listing.rules, smoking_allowed: e.target.checked } })}
                                                    className="accent-[#FD267A] w-5 h-5"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Pets Allowed</span>
                                                <select
                                                    value={listing.rules?.pets_allowed || 'no'}
                                                    onChange={(e) => setListing({ ...listing, rules: { ...listing.rules, pets_allowed: e.target.value } })}
                                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-[#FD267A]"
                                                >
                                                    <option value="no">No Pets</option>
                                                    <option value="cats">Cats Only</option>
                                                    <option value="dogs">Dogs Only</option>
                                                    <option value="all">All Pets</option>
                                                </select>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Visitors</span>
                                                <select
                                                    value={listing.rules?.visitors_allowed || 'yes'}
                                                    onChange={(e) => setListing({ ...listing, rules: { ...listing.rules, visitors_allowed: e.target.value } })}
                                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-[#FD267A]"
                                                >
                                                    <option value="yes">Anytime</option>
                                                    <option value="weekends">Weekends Only</option>
                                                    <option value="no">No Visitors</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEEKER FORM */}
                    {profile.role === 'seeker' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-[#FD267A] font-bold uppercase tracking-wider text-sm mb-4">My Preferences</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Max Budget</label>
                                            <input
                                                type="number"
                                                value={profile.preferences?.budget_max || ''}
                                                onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, budget_max: parseInt(e.target.value) } })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                                placeholder="$$$"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold">Move-in Date</label>
                                            <input
                                                type="date"
                                                value={profile.preferences?.move_in_date || ''}
                                                onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, move_in_date: e.target.value } })}
                                                className="w-full text-gray-800 border-b border-gray-200 focus:border-[#FD267A] outline-none py-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-2">Occupation</label>
                                        <select
                                            value={profile.preferences?.occupation || 'student'}
                                            onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, occupation: e.target.value } })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FD267A]"
                                        >
                                            <option value="student">Student</option>
                                            <option value="professional">Professional</option>
                                            <option value="remote">Remote Worker</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-2">Lifestyle</label>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">I smoke</span>
                                                <input
                                                    type="checkbox"
                                                    checked={profile.preferences?.smoker || false}
                                                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, smoker: e.target.checked } })}
                                                    className="accent-[#FD267A] w-5 h-5"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">I have pets</span>
                                                <select
                                                    value={profile.preferences?.pets || 'no'}
                                                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, pets: e.target.value } })}
                                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-[#FD267A]"
                                                >
                                                    <option value="no">No Pets</option>
                                                    <option value="dog">Dog</option>
                                                    <option value="cat">Cat</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vibe Check (Common) */}
                    <div className="mt-8">
                        <label className="text-xs text-gray-400 font-bold block mb-4 uppercase tracking-wider">Vibe Check</label>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-6">
                            {/* Cleanliness */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Relaxed</span>
                                    <span>Spotless</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={profile.preferences?.lifestyle?.cleanliness || 3}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        preferences: {
                                            ...(profile.preferences || {}),
                                            lifestyle: { ...(profile.preferences?.lifestyle || {}), cleanliness: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full accent-[#FD267A]"
                                />
                            </div>
                            {/* Schedule */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Early Bird</span>
                                    <span>Night Owl</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={profile.preferences?.lifestyle?.schedule || 3}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        preferences: {
                                            ...(profile.preferences || {}),
                                            lifestyle: { ...(profile.preferences?.lifestyle || {}), schedule: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full accent-[#FD267A]"
                                />
                            </div>
                            {/* Social */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Hermit</span>
                                    <span>Party Animal</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={profile.preferences?.lifestyle?.social || 3}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        preferences: {
                                            ...(profile.preferences || {}),
                                            lifestyle: { ...(profile.preferences?.lifestyle || {}), social: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full accent-[#FD267A]"
                                />
                            </div>
                            {/* Guests */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>No Guests</span>
                                    <span>Always</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={profile.preferences?.lifestyle?.guests || 3}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        preferences: {
                                            ...(profile.preferences || {}),
                                            lifestyle: { ...(profile.preferences?.lifestyle || {}), guests: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full accent-[#FD267A]"
                                />
                            </div>
                        </div>
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
        </div>
    )
}
