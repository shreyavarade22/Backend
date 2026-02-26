
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB();

// ==================== IMPORT ROUTES ====================
const signuproute = require('./signuproute');
const loginroute = require('./Loginroute');
const appointmentroute = require('./Appointmentroute');

const admitpatientroute = require('./Admitpatientroute');
const patientroute = require('./Patientroute');
const laboratoryroute = require('./Laboratoryroute'); // <-- ADD THIS LINE

// ==================== USE ROUTES ====================
app.use('/api', signuproute);
app.use('/api', loginroute);
app.use('/api', appointmentroute);

app.use('/api', admitpatientroute);
app.use('/api', patientroute);
app.use('/api', laboratoryroute); // <-- ADD THIS LINE

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Server is running',
        mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
        routes: {
            // Laboratory routes
            laboratory: 'GET/POST http://localhost:8001/api/laboratory',
            laboratoryStats: 'GET http://localhost:8001/api/laboratory/stats',
            laboratorySearch: 'GET http://localhost:8001/api/laboratory/search?query=',
            laboratoryByTest: 'GET http://localhost:8001/api/laboratory/test/:testType',
            laboratoryById: 'GET http://localhost:8001/api/laboratory/:id',
            updateResults: 'PATCH http://localhost:8001/api/laboratory/:testId/results',
            generateReport: 'POST http://localhost:8001/api/laboratory/:testId/report',
            
            // Appointment routes
            appointments: 'http://localhost:8001/api/appointments',
            appointmentFindAll: 'http://localhost:8001/api/appointmentfindall',
            
            // Admission routes
            admitPatient: 'http://localhost:8001/api/admitpatient',
            availableBeds: 'http://localhost:8001/api/availablebeds',
            admissionStats: 'http://localhost:8001/api/admissionstats',
            
            // Patient routes
            patients: 'http://localhost:8001/api/patients',
            patientStats: 'http://localhost:8001/api/patients/stats',
            patientSearch: 'http://localhost:8001/api/patients/search',
            
            // Test
            test: 'http://localhost:8001/test'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ 
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = 8001;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test\n`);
});