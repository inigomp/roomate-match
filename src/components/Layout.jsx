import { Outlet, Link, useLocation } from 'react-router-dom'
import { User, Flame, MessageCircle, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export default function Layout() {
    const location = useLocation()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/auth'
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center font-sans">
            {/* Mobile Container */}
            <div className="w-full h-[100dvh] md:h-[850px] md:w-[400px] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-gray-200 md:border">

                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-4 bg-white z-10 shrink-0 border-b border-gray-50">
                    <div className="w-10">
                        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition">
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="text-[#FD267A] font-bold text-xl tracking-tighter hidden">tinderflat</span>
                    </div>

                    <div className="w-10"></div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 relative overflow-hidden bg-gray-50">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="h-20 bg-white flex justify-around items-center px-6 shrink-0 z-20 pb-2">
                    <Link to="/" className="group relative">
                        <div className={`p-1 transition-transform group-active:scale-90`}>
                            <Flame
                                size={32}
                                className={location.pathname === '/' ? 'text-[#FD267A]' : 'text-gray-300'}
                                fill={location.pathname === '/' ? "currentColor" : "none"}
                            />
                        </div>
                    </Link>

                    <Link to="/chat" className="group relative">
                        <div className={`p-1 transition-transform group-active:scale-90`}>
                            <MessageCircle
                                size={32}
                                className={location.pathname === '/chat' ? 'text-[#FD267A]' : 'text-gray-300'}
                                fill={location.pathname === '/chat' ? "currentColor" : "none"}
                                strokeWidth={2.5}
                            />
                        </div>
                    </Link>

                    <Link to="/profile" className="group relative">
                        <div className={`p-1 transition-transform group-active:scale-90`}>
                            <User
                                size={32}
                                className={location.pathname === '/profile' ? 'text-[#FD267A]' : 'text-gray-300'}
                                fill={location.pathname === '/profile' ? "currentColor" : "none"}
                                strokeWidth={2.5}
                            />
                        </div>
                    </Link>
                </nav>
            </div>
        </div>
    )
}
