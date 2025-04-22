const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['ACCIDENT', 'MEDICAL', 'FIRE', 'POLICE', 'OTHER']
    },
    status: {
        type: String,
        required: true,
        default: 'PENDING',
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED']
    },
    severity: {
        type: String,
        required: true,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    reportedAt: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String
    },
    additionalDetails: {
        type: String
    }
});

module.exports = mongoose.model('Emergency', emergencySchema);
