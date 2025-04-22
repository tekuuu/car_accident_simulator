// Ethiopia's approximate bounding box
const ETHIOPIA_BOUNDS = {
    north: 14.8942, // Northern-most latitude
    south: 3.4041,  // Southern-most latitude
    east: 47.9824,  // Eastern-most longitude
    west: 32.9975   // Western-most longitude
};

// Major cities in Ethiopia for more realistic locations
const MAJOR_CITIES = [
    { name: 'Addis Ababa', lat: 9.0302, lng: 38.7452 },
    { name: 'Dire Dawa', lat: 9.5913, lng: 41.8664 },
    { name: 'Mekelle', lat: 13.4967, lng: 39.4767 },
    { name: 'Gondar', lat: 12.6030, lng: 37.4521 },
    { name: 'Bahir Dar', lat: 11.5742, lng: 37.3614 },
    { name: 'Hawassa', lat: 7.0504, lng: 38.4955 },
    { name: 'Jimma', lat: 7.6667, lng: 36.8333 },
    { name: 'Dessie', lat: 11.1333, lng: 39.6333 },
    { name: 'Jijiga', lat: 9.3500, lng: 42.8000 },
    { name: 'Shashamane', lat: 7.2000, lng: 38.6000 }
];

// Emergency types and their descriptions
const EMERGENCY_TYPES = [
    { type: 'ACCIDENT', descriptions: [
        'Car collision',
        'Motorcycle accident',
        'Vehicle rollover',
        'Pedestrian accident',
        'Multi-vehicle crash'
    ]},
    { type: 'MEDICAL', descriptions: [
        'Medical emergency',
        'Heart attack',
        'Injury',
        'Unconscious person',
        'Breathing difficulty'
    ]},
    { type: 'FIRE', descriptions: [
        'Building fire',
        'Vehicle fire',
        'Grass fire',
        'Electrical fire',
        'Commercial fire'
    ]}
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
        contactPhone: `+251-${Math.floor(Math.random() * 900000000 + 100000000)}`
    };
}

function generateMultipleEmergencies(count) {
    return Array.from({ length: count }, generateEmergency);
}

module.exports = {
    generateEmergency,
    generateMultipleEmergencies
};