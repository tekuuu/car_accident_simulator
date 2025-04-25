import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AccidentList() {
  const [accidents, setAccidents] = useState([]);
  const [serverLocation] = useState({ lat: 9.03, lng: 38.74 });

  useEffect(() => {
    axios.get('http://localhost:5001/api/emergencies')
      .then(response => {
        // Take only first 5 accidents
        const accidentData = response.data.slice(0, 5).map(item => ({
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
          address: item.address,
          carId: item.carId,
          contactPhone: item.contactPhone,
          severity: item.severity,
          status: item.status
        }));
        setAccidents(accidentData);
      })
      .catch(error => console.error('Error fetching accidents:', error));
  }, []);

  // Calculate distance using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
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

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Car Accident Reports</h1>
      <div className="grid gap-4">
        {accidents.map((accident, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold">{accident.description}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(accident.status)}`}>
                {accident.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Car ID:</span>{' '}
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {accident.carId}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Contact:</span>{' '}
                  {accident.contactPhone}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span>{' '}
                  {accident.address}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Severity:</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(accident.severity)}`}>
                    {accident.severity}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Distance:</span>{' '}
                  {accident.distance} km
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                Reported: {new Date(accident.reportedAt).toLocaleString()}
              </p>
              <Link 
                to={`/map?lat=${accident.lat}&lng=${accident.lng}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
              >
                View on Map
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccidentList;
