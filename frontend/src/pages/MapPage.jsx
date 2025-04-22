import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom location marker icon
const locationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle location finding
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate({
            setView: true,
            maxZoom: 16
        });

        map.on('locationfound', (e) => {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 16);
        });

        map.on('locationerror', (e) => {
            console.error('Error finding location:', e.message);
            alert('Could not find your location. Please enable location services.');
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={locationIcon}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

function MapPage() {
    const [accidents, setAccidents] = useState([]);
    const serverLocation = { lat: 9.03, lng: 38.74 };
    const mapRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5000/emergencies')
            .then(response => {
                setAccidents(response.data);
            })
            .catch(error => console.error('Error fetching accidents:', error));
    }, []);

    return (
        <div className="h-screen relative">
            <div className="absolute top-4 left-4 z-[1000] flex gap-2">
                <Link 
                    to="/" 
                    className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100"
                >
                    Back to List
                </Link>
                <button
                    onClick={() => {
                        mapRef.current?.locate({
                            setView: true,
                            maxZoom: 16
                        });
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                    Find My Location
                </button>
            </div>
            <MapContainer 
                center={[serverLocation.lat, serverLocation.lng]} 
                zoom={13} 
                style={{ height: '100vh', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
                {/* Server Location Marker */}
                <Marker position={[serverLocation.lat, serverLocation.lng]}>
                    <Popup>Server Location</Popup>
                </Marker>
                {/* Accident Markers */}
                {accidents.map((accident, index) => (
                    <Marker 
                        key={index} 
                        position={[accident.lat, accident.lng]}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{accident.description}</h3>
                                <p>Location: ({accident.lat}, {accident.lng})</p>
                                <p>Reported: {new Date(accident.reportedAt).toLocaleString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapPage;
