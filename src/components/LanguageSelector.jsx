import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function LanguageSelector() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    const changeLanguage = (code) => {
        i18n.changeLanguage(code)
        localStorage.setItem('language', code)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
            >
                <Globe size={20} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition ${lang.code === i18n.language ? 'bg-orange-50 text-[#FF6B35] font-bold' : 'text-gray-700'
                                    }`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
