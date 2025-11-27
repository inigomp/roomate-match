import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import ProfileSetup from './pages/ProfileSetup'
import Swipe from './pages/Swipe'
import Chat from './pages/Chat'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Swipe />} />
                        <Route path="/profile" element={<ProfileSetup />} />
                        <Route path="/chat" element={<Chat />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
