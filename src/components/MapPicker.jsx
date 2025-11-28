import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Vite
// Using online URLs to avoid build issues with local assets
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map click events
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng)
        },
    })

    return position === null ? null : <Marker position={position} icon={icon} />
}

export default function MapPicker({ initialPosition, onLocationChange }) {
    const [position, setPosition] = useState(initialPosition || { lat: 40.4168, lng: -3.7038 }) // Default: Madrid
    const [address, setAddress] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        if (onLocationChange) {
            onLocationChange(position, address)
        }
    }, [position, address])

    const searchAddress = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            )
            const data = await response.json()

            if (data && data[0]) {
                const { lat, lon, display_name } = data[0]
                setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) })
                setAddress(display_name)
            } else {
                alert('Address not found. Please try a different search.')
            }
        } catch (error) {
            console.error('Geocoding error:', error)
            alert('Error searching for address. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="space-y-3">
            {/* Address Search */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                    placeholder="Search address (e.g., Calle Mayor, Madrid)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF6B35] text-sm"
                />
                <button
                    onClick={searchAddress}
                    disabled={isSearching}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-bold text-sm hover:bg-[#F7931E] transition disabled:opacity-50"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Selected Address Display */}
            {address && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    📍 {address}
                </div>
            )}

            {/* Map */}
            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 z-0">
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    key={`${position.lat}-${position.lng}`}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>

            <p className="text-xs text-gray-400 italic">
                Click on the map to adjust the pin location
            </p>
        </div>
    )
}
