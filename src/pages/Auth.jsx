import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/logo.png'
import LanguageSelector from '../components/LanguageSelector'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

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
                alert(t('auth.checkEmail'))
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
        <div className="min-h-screen tinder-gradient flex flex-col items-center justify-center p-6 text-white relative">
            <div className="absolute top-4 right-4">
                <LanguageSelector />
            </div>

            <div className="w-full max-w-sm flex flex-col items-center">

                <div className="flex flex-col items-center gap-4 mb-12">
                    <div className="bg-white p-4 rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition duration-300">
                        <img src={logo} alt={t('app.name')} className="w-20 h-20 object-contain" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter drop-shadow-md">{t('app.name').toLowerCase()}</h1>
                </div>

                <div className="w-full space-y-6">
                    <h2 className="text-center text-2xl font-semibold mb-8">
                        {isSignUp ? t('auth.createAccount') : t('auth.welcome')}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.email')}
                                className="w-full px-6 py-3 rounded-full bg-white/20 border-2 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white outline-none transition backdrop-blur-sm"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.password')}
                                className="w-full px-6 py-3 rounded-full bg-white/20 border-2 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white outline-none transition backdrop-blur-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-[#FF6B35] font-bold text-lg py-3 rounded-full shadow-lg hover:bg-gray-50 transition transform active:scale-95 disabled:opacity-70 uppercase tracking-wide"
                        >
                            {loading ? t('auth.loading') : isSignUp ? t('auth.signup') : t('auth.login')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-white/90 font-medium hover:underline text-sm uppercase tracking-wider"
                        >
                            {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}
                        </button>
                    </div>

                    <div className="mt-12 text-center text-xs text-white/60">
                        <p>{t('auth.termsText')}</p>
                        <p>{t('auth.privacyText')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
