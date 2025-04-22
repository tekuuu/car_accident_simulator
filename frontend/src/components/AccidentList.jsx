import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AccidentList() {
  const [locations, setLocations] = useState([]);
  const [serverLocation] = useState({ lat: 9.03, lng: 38.74 }); // Server location

  useEffect(() => {
    axios.get('http://localhost:5001/api/emergencies')  // Updated endpoint
      .then(response => {
        // Take only first 5 locations
        const locationData = response.data.slice(0, 5).map(item => ({
          description: item.description,
          lat: item.lat,
          lng: item.lng,
          distance: calculateDistance(
            serverLocation.lat,
            serverLocation.lng,
            item.lat,
            item.lng
          ),
          reportedAt: item.reportedAt,
          address: item.address
        }));
        setLocations(locationData);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  // Calculate distance using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
  }

  function toRad(degrees) {
    return degrees * (Math.PI/180);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Location Reports</h1>
      <div className="grid gap-4">
        {locations.map((location, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{location.description}</h2>
            <p className="text-gray-600">Address: {location.address}</p>
            <p className="text-gray-600">
              Coordinates: ({location.lat}, {location.lng})
            </p>
            <p className="text-blue-600 font-semibold">
              Distance from server: {location.distance} km
            </p>
            <p className="text-gray-500 text-sm mb-3">
              Reported: {new Date(location.reportedAt).toLocaleString()}
            </p>
            <Link 
              to={`/map?lat=${location.lat}&lng=${location.lng}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              View on Map
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccidentList;
