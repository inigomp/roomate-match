import { useState, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'

export default function LocationPicker({ initialAddress, onLocationChange }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(initialAddress || '')

    const searchAddress = async () => {
        if (!query.trim()) return
        setSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            )
            const data = await response.json()
            setResults(data)
        } catch (error) {
            console.error('Error searching address:', error)
        } finally {
            setSearching(false)
        }
    }

    const selectAddress = (item) => {
        const address = item.display_name
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)

        setSelectedAddress(address)
        setResults([])
        setQuery('')

        if (onLocationChange) {
            onLocationChange({ lat, lng }, address)
        }
    }

    return (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                    placeholder="Search city or address..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <button
                    onClick={searchAddress}
                    disabled={searching}
                    className="absolute right-2 top-1.5 px-3 py-1 bg-[#FF6B35] text-white text-xs rounded-md hover:bg-[#F7931E]"
                >
                    {searching ? '...' : 'Search'}
                </button>
            </div>

            {/* Results Dropdown */}
            {results.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.map((item) => (
                        <div
                            key={item.place_id}
                            onClick={() => selectAddress(item)}
                            className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-start gap-2"
                        >
                            <MapPin size={16} className="text-[#FF6B35] mt-1 shrink-0" />
                            <span className="text-sm text-gray-700">{item.display_name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Selection */}
            {selectedAddress && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-2">
                    <MapPin size={20} className="text-[#FF6B35] mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">Selected Location:</p>
                        <p className="text-sm text-gray-600">{selectedAddress}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
