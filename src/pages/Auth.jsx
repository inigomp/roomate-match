import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('Check your email for the login link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/')
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen tinder-gradient flex flex-col items-center justify-center p-6 text-white">
            <div className="w-full max-w-sm flex flex-col items-center">

                <div className="flex flex-col items-center gap-4 mb-12">
                    <div className="bg-white p-4 rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition duration-300">
                        <img src={logo} alt="TinderFlat Logo" className="w-20 h-20 object-contain" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter drop-shadow-md">tinderflat</h1>
                </div>

                <div className="w-full space-y-6">
                    <h2 className="text-center text-2xl font-semibold mb-8">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-6 py-3 rounded-full bg-white/20 border-2 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white outline-none transition backdrop-blur-sm"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-6 py-3 rounded-full bg-white/20 border-2 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white outline-none transition backdrop-blur-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-[#FD267A] font-bold text-lg py-3 rounded-full shadow-lg hover:bg-gray-50 transition transform active:scale-95 disabled:opacity-70 uppercase tracking-wide"
                        >
                            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-white/90 font-medium hover:underline text-sm uppercase tracking-wider"
                        >
                            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>

                    <div className="mt-12 text-center text-xs text-white/60">
                        <p>By signing in, you agree to our Terms.</p>
                        <p>Learn how we process your data in our Privacy Policy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
