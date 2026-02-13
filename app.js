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
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Connect to MongoDB
// connectDB();

// // Test route
// app.get('/test', (req, res) => {
//     res.json({ 
//         success: true,
//         message: '✅ Server is running',
//         timestamp: new Date().toISOString(),
//         mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
//         endpoints: {
//             // Auth endpoints
//             signup: 'POST /api/signup',
//             login: 'POST /api/login',
//             logout: 'POST /api/logout',
//             verifyToken: 'GET /api/verify-token',
//             getUsers: 'GET /api/signupfind',
//             getLogins: 'GET /api/loginfind',
            
//             // Appointment endpoints
//             createAppointment: 'POST /api/appointments',
//             getAllAppointments: 'GET /api/appointments',
//             getTodaysAppointments: 'GET /api/appointments/today',
//             getAppointmentStats: 'GET /api/appointments/stats',
//             getAppointmentById: 'GET /api/appointments/:id',
//             getAppointmentsByDate: 'GET /api/appointments/date/:date',
//             getAppointmentsByDoctor: 'GET /api/appointments/doctor/:doctorName',
//             updateAppointmentStatus: 'PATCH /api/appointments/:id/status',
//             updateAppointment: 'PUT /api/appointments/:id',
//             deleteAppointment: 'DELETE /api/appointments/:id'
//         }
//     });
// });

// // ==================== IMPORT ROUTES ====================
// const signuproute = require('./routes/signuproute');
// const loginroute = require('./routes/Loginroute');
// const appointmentRoutes = require('./routes/AppointmentRoutes');

// // ==================== USE ROUTES ====================
// app.use('/api', signuproute);
// app.use('/api', loginroute);
// app.use('/api', appointmentRoutes);

// // 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found',
//         path: req.originalUrl
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error("❌ Server Error:", err);
//     res.status(500).json({ 
//         success: false,
//         error: "Internal server error",
//         message: err.message 
//     });
// });

// // Start server
// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log("\n" + "=".repeat(60));
//     console.log("🚀 SERVER STARTED SUCCESSFULLY!");
//     console.log("=".repeat(60));
//     console.log(`📍 URL: http://localhost:${PORT}`);
//     console.log(`📡 API Base: http://localhost:${PORT}/api`);
//     console.log(`🧪 Test: http://localhost:${PORT}/test`);
//     console.log("\n" + "=".repeat(60));
//     console.log("📌 AUTHENTICATION ENDPOINTS:");
//     console.log("=".repeat(60));
//     console.log(`📝 Signup: POST http://localhost:${PORT}/api/signup`);
//     console.log(`🔐 Login: POST http://localhost:${PORT}/api/login`);
//     console.log(`🚪 Logout: POST http://localhost:${PORT}/api/logout`);
//     console.log(`✅ Verify: GET http://localhost:${PORT}/api/verify-token`);
//     console.log(`📋 Get Users: GET http://localhost:${PORT}/api/signupfind`);
//     console.log(`📋 Get Logins: GET http://localhost:${PORT}/api/loginfind`);
    
//     console.log("\n" + "=".repeat(60));
//     console.log("📅 APPOINTMENT ENDPOINTS:");
//     console.log("=".repeat(60));
//     console.log(`📅 Create: POST http://localhost:${PORT}/api/appointments`);
//     console.log(`📋 Get All: GET http://localhost:${PORT}/api/appointments`);
//     console.log(`🗓️ Get Today: GET http://localhost:${PORT}/api/appointments/today`);
//     console.log(`📊 Get Stats: GET http://localhost:${PORT}/api/appointments/stats`);
//     console.log(`🔍 Get By ID: GET http://localhost:${PORT}/api/appointments/:id`);
//     console.log(`📆 Get By Date: GET http://localhost:${PORT}/api/appointments/date/:date`);
//     console.log(`👨‍⚕️ Get By Doctor: GET http://localhost:${PORT}/api/appointments/doctor/:doctorName`);
//     console.log(`🔄 Update Status: PATCH http://localhost:${PORT}/api/appointments/:id/status`);
//     console.log(`✏️ Update: PUT http://localhost:${PORT}/api/appointments/:id`);
//     console.log(`❌ Delete: DELETE http://localhost:${PORT}/api/appointments/:id`);
//     console.log("=".repeat(60) + "\n");
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
const Appointmentroute = require('./Appointmentroute');

// ==================== USE ROUTES ====================
app.use('/api', signuproute);
app.use('/api', loginroute);
app.use('/api', Appointmentroute);

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Server is running',
        mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'
    });
});

// 404 handler - This should be LAST
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
        message: err.message 
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test\n`);
});