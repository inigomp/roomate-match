import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Heart, X, MapPin, DollarSign, Info } from 'lucide-react'

export default function Swipe() {
    const [loading, setLoading] = useState(true)
    const [candidates, setCandidates] = useState([])
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get current user profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            setCurrentUser(profile)

            // Get matches to exclude
            const { data: matches } = await supabase
                .from('matches')
                .select('target_id')
                .eq('user_id', user.id)

            const seenIds = matches?.map(m => m.target_id) || []
            seenIds.push(user.id) // Exclude self

            let potentialMatches = []

            if (profile.role === 'seeker') {
                const { data: listings } = await supabase
                    .from('listings')
                    .select('*, host:users(*)')

                if (listings) {
                    potentialMatches = listings.filter(l => !seenIds.includes(l.host_id))
                    // Basic filtering can go here
                }
            } else {
                const { data: seekers } = await supabase
                    .from('users')
                    .select('*')
                    .eq('role', 'seeker')

                if (seekers) {
                    potentialMatches = seekers.filter(s => !seenIds.includes(s.id))
                }
            }

            setCandidates(potentialMatches)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const removeCard = (id, direction) => {
        setCandidates(prev => prev.filter(item => {
            const itemId = currentUser.role === 'seeker' ? item.host_id : item.id
            return itemId !== id
        }))
    }

    const handleSwipe = async (direction, item) => {
        const targetId = currentUser.role === 'seeker' ? item.host_id : item.id
        removeCard(targetId, direction)

        if (direction === 'right') {
            await supabase.from('matches').insert({
                user_id: currentUser.id,
                target_id: targetId,
                status: 'liked'
            })

            // Check mutual
            const { data: mutual } = await supabase
                .from('matches')
                .select('*')
                .eq('user_id', targetId)
                .eq('target_id', currentUser.id)
                .eq('status', 'liked')
                .single()

            if (mutual) {
                // Could show a modal here
                console.log("It's a match!")
            }
        } else {
            await supabase.from('matches').insert({
                user_id: currentUser.id,
                target_id: targetId,
                status: 'disliked'
            })
        }
    }

    if (loading) return <div className="flex justify-center items-center h-full text-rose-500 animate-pulse">Finding matches...</div>

    return (
        <div className="h-full w-full flex flex-col relative">
            <div className="flex-1 relative w-full h-full flex justify-center items-center p-2">
                <AnimatePresence>
                    {candidates.length === 0 ? (
                        <div className="text-center p-8 text-gray-400">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Info size={40} />
                            </div>
                            <p className="text-lg">No more profiles around you.</p>
                        </div>
                    ) : (
                        candidates.map((item, index) => {
                            // Only render the top 2 cards for performance
                            if (index > candidates.length - 3) {
                                return (
                                    <Card
                                        key={currentUser.role === 'seeker' ? item.host_id : item.id}
                                        item={item}
                                        role={currentUser.role}
                                        onSwipe={(dir) => handleSwipe(dir, item)}
                                        isTop={index === candidates.length - 1}
                                    />
                                )
                            }
                            return null
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function Card({ item, role, onSwipe, isTop }) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-25, 25])
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

    // Stamp opacity
    const likeOpacity = useTransform(x, [20, 150], [0, 1])
    const nopeOpacity = useTransform(x, [-20, -150], [0, 1])

    const handleDragEnd = (event, info) => {
        const threshold = 100
        if (info.offset.x > threshold) {
            onSwipe('right')
        } else if (info.offset.x < -threshold) {
            onSwipe('left')
        }
    }

    const isListing = role === 'seeker'
    const title = isListing ? item.title : item.full_name
    const subtitle = isListing ? item.location : item.bio
    const image = isListing
        ? (item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')
        : (item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1760&q=80')
    const price = isListing ? item.price : null

    return (
        <motion.div
            style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.2 } }}
            className={`absolute w-[95%] h-[95%] max-h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none ${!isTop && 'pointer-events-none'}`}
        >
            {/* Image Background */}
            <div className="absolute inset-0">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
            </div>

            {/* Stamps */}
            {isTop && (
                <>
                    <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 -rotate-12 z-20">
                        <span className="text-green-500 font-bold text-4xl tracking-widest uppercase">LIKE</span>
                    </motion.div>
                    <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-12 z-20">
                        <span className="text-red-500 font-bold text-4xl tracking-widest uppercase">NOPE</span>
                    </motion.div>
                </>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <div className="flex items-end justify-between mb-2">
                    <h2 className="text-3xl font-bold leading-tight shadow-black drop-shadow-md">{title}</h2>
                    {price && (
                        <span className="text-2xl font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            ${price}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-gray-100 mb-4">
                    <MapPin size={18} />
                    <p className="text-lg font-medium truncate">{subtitle}</p>
                </div>

                {/* Action Buttons (Visual Only - actual action is swipe) */}
                {isTop && (
                    <div className="flex justify-center gap-6 mt-4 pt-4">
                        <button
                            className="w-14 h-14 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition"
                            onClick={(e) => { e.stopPropagation(); onSwipe('left'); }}
                        >
                            <X size={28} strokeWidth={3} />
                        </button>
                        <button
                            className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
                            onClick={(e) => { e.stopPropagation(); onSwipe('right'); }}
                        >
                            <Heart size={28} fill="currentColor" strokeWidth={0} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
