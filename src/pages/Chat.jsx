import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Send, ArrowLeft, Shield, MessageCircle } from 'lucide-react'

export default function Chat() {
    const [matches, setMatches] = useState([])
    const [activeMatch, setActiveMatch] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        loadMatches()
    }, [])

    useEffect(() => {
        if (activeMatch) {
            loadMessages(activeMatch.id)

            const channel = supabase
                .channel('public:messages')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${currentUser.id}`
                }, (payload) => {
                    if (payload.new.sender_id === activeMatch.id) {
                        setMessages(prev => [...prev, payload.new])
                    }
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [activeMatch])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    async function loadMatches() {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        const { data: myLikes } = await supabase
            .from('matches')
            .select('target_id')
            .eq('user_id', user.id)
            .eq('status', 'liked')

        if (!myLikes?.length) return

        const myLikeIds = myLikes.map(m => m.target_id)

        const { data: mutuals } = await supabase
            .from('matches')
            .select('user_id')
            .in('user_id', myLikeIds)
            .eq('target_id', user.id)
            .eq('status', 'liked')

        if (!mutuals?.length) return

        const mutualIds = mutuals.map(m => m.user_id)

        const { data: profiles } = await supabase
            .from('users')
            .select('*')
            .in('id', mutualIds)

        setMatches(profiles || [])
    }

    async function loadMessages(otherId) {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${currentUser.id})`)
            .order('created_at', { ascending: true })

        setMessages(data || [])
    }

    async function sendMessage(e) {
        e.preventDefault()
        if (!newMessage.trim()) return

        const msg = {
            sender_id: currentUser.id,
            receiver_id: activeMatch.id,
            content: newMessage
        }

        setMessages([...messages, { ...msg, created_at: new Date().toISOString() }])
        setNewMessage('')

        const { error } = await supabase.from('messages').insert(msg)
        if (error) console.error('Error sending message:', error)
    }

    if (activeMatch) {
        return (
            <div className="flex flex-col h-full bg-white">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b flex items-center gap-3 bg-white shadow-sm z-10">
                    <button onClick={() => setActiveMatch(null)} className="text-[#FF655B] -ml-2">
                        <ArrowLeft size={28} />
                    </button>
                    <div className="relative">
                        <img
                            src={activeMatch.avatar_url || 'https://via.placeholder.com/40'}
                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            alt={activeMatch.full_name}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                        <h2 className="font-bold text-gray-800 text-sm">{activeMatch.full_name || 'User'}</h2>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Shield size={10} />
                            <span>Verified Match</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                    <div className="text-center text-xs text-gray-300 py-4 uppercase tracking-widest font-bold">
                        Today
                    </div>
                    {messages.map((msg, i) => {
                        const isMe = msg.sender_id === currentUser.id
                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm ${isMe
                                    ? 'bg-[#1195F5] text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-3 bg-white border-t flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Say something nice..."
                        className="flex-1 px-5 py-3 rounded-full bg-gray-100 focus:bg-white border border-transparent focus:border-gray-300 outline-none transition text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 rounded-full text-[#FD267A] hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Matches Header */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-[#FD267A] font-bold text-sm uppercase tracking-wide mb-4">New Matches</h1>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {matches.length === 0 && (
                        <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse"></div>
                    )}
                    {matches.map(match => (
                        <div key={match.id} onClick={() => setActiveMatch(match)} className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                            <div className="w-16 h-16 rounded-full p-[2px] tinder-gradient">
                                <img
                                    src={match.avatar_url || 'https://via.placeholder.com/60'}
                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                    alt={match.full_name}
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{(match.full_name || 'User').split(' ')[0]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-[1px] bg-gray-100 mx-4 my-2"></div>

            {/* Messages List */}
            <div className="flex-1 px-4">
                <h1 className="text-[#FD267A] font-bold text-sm uppercase tracking-wide mb-4 mt-2">Messages</h1>
                <div className="space-y-4">
                    {matches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <MessageCircle size={30} className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-sm">No messages yet.</p>
                            <p className="text-gray-300 text-xs">Get swiping to find matches!</p>
                        </div>
                    ) : (
                        matches.map(match => (
                            <div
                                key={match.id}
                                onClick={() => setActiveMatch(match)}
                                className="flex items-center gap-4 cursor-pointer active:bg-gray-50 -mx-4 px-4 py-2 transition"
                            >
                                <img
                                    src={match.avatar_url || 'https://via.placeholder.com/60'}
                                    className="w-16 h-16 rounded-full object-cover"
                                    alt={match.full_name}
                                />
                                <div className="flex-1 border-b border-gray-100 pb-4">
                                    <h3 className="font-bold text-gray-800 text-base">{match.full_name || 'User'}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">You matched! Say hello 👋</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
