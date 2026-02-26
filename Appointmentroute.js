const express = require('express');
const router = express.Router();

// ✅ FIXED: Direct file path (no 'controllers' folder)
const appointmentController = require('./Appointmentcontroller.js');

// ==================== APPOINTMENT ROUTES ====================

// Create new appointment
router.post('/appointments', appointmentController.createAppointment);

// Get all appointments
router.get('/appointments', appointmentController.getAllAppointments);

// Get appointment statistics
router.get('/appointments/stats', appointmentController.getAppointmentStats);

// Get today's appointments
router.get('/appointments/today', appointmentController.getTodaysAppointments);

// Update appointment status
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);

// Delete/cancel appointment
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;