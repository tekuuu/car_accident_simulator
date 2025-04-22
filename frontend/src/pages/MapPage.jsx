import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons for different emergency types
const icons = {
    ACCIDENT: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    MEDICAL: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    FIRE: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    POLICE: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    OTHER: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
};

function getSeverityColor(severity) {
    switch (severity) {
        case 'CRITICAL': return 'text-red-600';
        case 'HIGH': return 'text-orange-500';
        case 'MEDIUM': return 'text-yellow-500';
        case 'LOW': return 'text-green-500';
        default: return 'text-gray-500';
    }
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
        case 'RESOLVED': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

function MapPage() {
    const [searchParams] = useSearchParams();
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    // Get coordinates from URL parameters or use default
    const centerLat = parseFloat(searchParams.get('lat')) || 9.0302;
    const centerLng = parseFloat(searchParams.get('lng')) || 38.7452;
    const defaultLocation = { lat: centerLat, lng: centerLng };

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const fetchEmergencies = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/emergencies');
            setEmergencies(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch emergencies');
            setLoading(false);
            console.error('Error fetching emergencies:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="h-screen w-full relative">
            <MapContainer
                center={defaultLocation}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {emergencies.map((emergency, index) => (
                    <Marker 
                        key={index} 
                        position={[emergency.lat, emergency.lng]}
                        icon={icons[emergency.type] || icons.OTHER}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-lg mb-2">{emergency.description}</h3>
                                <p className="text-sm">
                                    <span className="font-semibold">Location:</span> {emergency.address}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Reported:</span>{' '}
                                    {new Date(emergency.reportedAt).toLocaleString()}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapPage;
