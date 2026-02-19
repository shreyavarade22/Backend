// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require('cors');
// const connectDB = require('./db');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));

// // Connect to MongoDB
// connectDB();

// // ==================== IMPORT ROUTES ====================
// const signuproute = require('./signuproute');
// const loginroute = require('./Loginroute');
// const appointmentroute = require('./Appointmentroute');
// const patientroute = require('./Patientroute'); // Old patient routes
// const newPatientroute = require('./NewPatientroute'); // New patient routes

// // ==================== USE ROUTES ====================
// app.use('/api', signuproute);
// app.use('/api', loginroute);
// app.use('/api', appointmentroute);
// app.use('/api', patientroute); // This handles /api/patients (old)
// app.use('/api/v2/patients', newPatientroute); // CHANGED: Use /api/v2/patients for new routes

// // Test route
// app.get('/test', (req, res) => {
//     res.json({ 
//         success: true,
//         message: '✅ Server is running',
//         mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
//         routes: {
//             oldPatients: 'http://localhost:8000/api/patients',
//             newPatients: 'http://localhost:8000/api/v2/patients',
//             register: 'http://localhost:8000/api/v2/patients/register',
//             stats: 'http://localhost:8000/api/v2/patients/stats'
//         }
//     });
// });

// // 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found',
//         path: req.originalUrl
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error("❌ Server Error:", err);
//     res.status(500).json({ 
//         success: false,
//         message: err.message,
//         stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
// });

// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//     console.log(`🧪 Test: http://localhost:${PORT}/test\n`);
// });
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
    credentials: true
}));

// Connect to MongoDB
connectDB();

// ==================== IMPORT ROUTES ====================
const signuproute = require('./signuproute');
const loginroute = require('./Loginroute');
const appointmentroute = require('./Appointmentroute');
const newPatientroute = require('./NewPatientroute'); // New patient routes

// ==================== USE ROUTES ====================
app.use('/api', signuproute);
app.use('/api', loginroute);
app.use('/api', appointmentroute);
app.use('/api/patients', newPatientroute); // Use this for all patient routes

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Server is running',
        mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
        routes: {
            patients: 'http://localhost:8000/api/patients',
            register: 'http://localhost:8000/api/patients (POST)',
            stats: 'http://localhost:8000/api/patients/stats'
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

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test\n`);
});