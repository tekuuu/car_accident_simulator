import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function getSeverityColor(severity) {
    switch (severity) {
        case 'CRITICAL': return 'text-red-600';
        case 'HIGH': return 'text-orange-500';
        case 'MEDIUM': return 'text-yellow-500';
        case 'LOW': return 'text-green-500';
        default: return 'text-gray-500';
    }
}

function MapPage() {
    const [searchParams] = useSearchParams();
    const [emergencies, setEmergencies] = useState([]);
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    
    const paramLat = parseFloat(searchParams.get('lat')) || 9.0302;
    const paramLng = parseFloat(searchParams.get('lng')) || 38.7468;

    useEffect(() => {
        axios.get('http://localhost:5001/api/emergencies')
            .then(response => setEmergencies(response.data))
            .catch(error => console.error('Error fetching emergencies:', error));
    }, []);

    return (
        <div className="w-full h-screen">
            <MapContainer
                center={[paramLat, paramLng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {emergencies.map((emergency, index) => (
                    <Marker
                        key={index}
                        position={[emergency.lat, emergency.lng]}
                        eventHandlers={{
                            click: () => setSelectedEmergency(emergency),
                        }}
                    >
                        {selectedEmergency === emergency && (
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold mb-2">{emergency.description}</h3>
                                    <p className="mb-1">
                                        <span className="font-semibold">Status: </span>
                                        {emergency.status}
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-semibold">Severity: </span>
                                        <span className={getSeverityColor(emergency.severity)}>
                                            {emergency.severity}
                                        </span>
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-semibold">Address: </span>
                                        {emergency.address}
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-semibold">Reported: </span>
                                        {new Date(emergency.reportedAt).toLocaleString()}
                                    </p>
                                </div>
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapPage;
