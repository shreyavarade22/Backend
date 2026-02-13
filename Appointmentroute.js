const express = require('express');
const router = express.Router();

// IMPORT the controller - make sure the path and filename are CORRECT
const appointmentController = require('./Appointmentcontroller'); // Note: .js extension not needed

// ==================== APPOINTMENT ROUTES ====================

// Create new appointment
router.post('/appointments', appointmentController.createAppointment);

// Get all appointments
router.get('/appointmentfindall', appointmentController.getAllAppointments);

// Get appointment statistics
router.get('/appointments/stats', appointmentController.getAppointmentStats);

// Get today's appointments
router.get('/appointments/today', appointmentController.getTodaysAppointments);

// Update appointment status
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);

// Delete/cancel appointment
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;