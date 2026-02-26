const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
    testId: {
        type: String,
        required: true,
        unique: true
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    bloodGroup: {
        type: String,
        default: ''
    },
    symptoms: {
        type: String,
        default: ''
    },
    testName: {
        type: String,
        enum: ['2D-Echocardiogram', 'Electrocardiogram', 'Treadmill Test'],
        required: true
    },
    testDate: {
        type: String,
        required: true
    },
    testTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    // Reference to source (appointment or registered patient)
    sourceId: {
        type: String,
        default: null
    },
    sourceType: {
        type: String,
        enum: ['appointment', 'patient', null],
        default: null
    },
    // Test results
    results: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    reportGenerated: {
        type: Boolean,
        default: false
    },
    reportDate: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for better search performance
laboratorySchema.index({ patientName: 'text', phone: 'text', testName: 1 });

module.exports = mongoose.model('Laboratory', laboratorySchema);