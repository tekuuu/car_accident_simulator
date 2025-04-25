const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// Get all emergencies
router.get('/', async (req, res) => {
    try {
        const emergencies = await Emergency.find().sort({ reportedAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new emergency
router.post('/', async (req, res) => {
    const emergency = new Emergency({
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        type: req.body.type,
        severity: req.body.severity,
        address: req.body.address,
        contactPhone: req.body.contactPhone,
        additionalDetails: req.body.additionalDetails,
        carId: req.body.carId
    });

    try {
        const newEmergency = await emergency.save();
        res.status(201).json(newEmergency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update emergency status
router.patch('/:id', async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        if (req.body.status) {
            emergency.status = req.body.status;
        }
        const updatedEmergency = await emergency.save();
        res.json(updatedEmergency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get emergency by ID
router.get('/:id', async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        if (emergency) {
            res.json(emergency);
        } else {
            res.status(404).json({ message: 'Emergency not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
