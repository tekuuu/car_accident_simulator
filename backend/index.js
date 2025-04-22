const express = require('express');
const cors = require('cors');
const { generateMultipleEmergencies } = require('./utils/locationGenerator');

const app = express();
const PORT = process.env.PORT || 5001;

// Generate 10 random emergencies
let emergencies = generateMultipleEmergencies(10);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/emergencies', (req, res) => {
    res.json(emergencies);
});

// Optional: Endpoint to regenerate emergencies
app.post('/api/regenerate', (req, res) => {
    emergencies = generateMultipleEmergencies(10);
    res.json(emergencies);
});

app.post('/api/emergencies', (req, res) => {
    const newEmergency = {
        ...req.body,
        reportedAt: new Date()
    };
    emergencies.push(newEmergency);
    res.status(201).json(newEmergency);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
