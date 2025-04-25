// Ethiopia's approximate bounding box
const ETHIOPIA_BOUNDS = {
    north: 14.8937,
    south: 3.4041,
    west: 33.0012,
    east: 47.9823
};

// Major cities in Ethiopia for more realistic locations
const MAJOR_CITIES = [
    { name: 'Addis Ababa', lat: 9.0302, lng: 38.7468 },
    { name: 'Dire Dawa', lat: 9.5933, lng: 41.8661 },
    { name: 'Mekelle', lat: 13.4967, lng: 39.4767 },
    { name: 'Gondar', lat: 12.6030, lng: 37.4521 },
    { name: 'Bahir Dar', lat: 11.5842, lng: 37.3908 }
];

const EMERGENCY_TYPES = [
    {
        type: 'ACCIDENT',
        descriptions: [
            'Car collision',
            'Vehicle rollover',
            'Multi-vehicle crash',
            'Rear-end collision',
            'Side-impact collision',
            'Head-on collision',
            'Parking lot accident',
            'Highway accident',
            'Intersection crash',
            'Single vehicle accident'
        ]
    }
];

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function generateRandomLocation() {
    // 70% chance to generate location near a major city
    if (Math.random() < 0.7) {
        const city = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
        // Generate location within ~10km of the city
        const latOffset = randomInRange(-0.1, 0.1);
        const lngOffset = randomInRange(-0.1, 0.1);
        return {
            lat: city.lat + latOffset,
            lng: city.lng + lngOffset,
            address: `Near ${city.name}`
        };
    }

    // 30% chance to generate random location within Ethiopia
    return {
        lat: randomInRange(ETHIOPIA_BOUNDS.south, ETHIOPIA_BOUNDS.north),
        lng: randomInRange(ETHIOPIA_BOUNDS.west, ETHIOPIA_BOUNDS.east),
        address: 'Rural area'
    };
}

function generateEmergency() {
    const location = generateRandomLocation();
    const emergencyType = EMERGENCY_TYPES[Math.floor(Math.random() * EMERGENCY_TYPES.length)];
    const description = emergencyType.descriptions[Math.floor(Math.random() * emergencyType.descriptions.length)];
    
    return {
        description,
        type: emergencyType.type,
        lat: location.lat,
        lng: location.lng,
        status: Math.random() < 0.7 ? 'PENDING' : 'IN_PROGRESS',
        severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
        reportedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in last 24 hours
        address: location.address,
        contactPhone: `+251-${Math.floor(Math.random() * 900000000 + 100000000)}`,
        carId: `ETH-${Math.floor(Math.random() * 100000)}`
    };
}

function generateMultipleEmergencies(count) {
    return Array.from({ length: count }, () => generateEmergency());
}

module.exports = {
    generateEmergency,
    generateMultipleEmergencies
};
