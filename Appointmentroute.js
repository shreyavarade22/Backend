const express = require('express');
const router = express.Router();

// IMPORT the controller
const appointmentController = require('./Appointmentcontroller');

// ==================== APPOINTMENT ROUTES ====================

// Create new appointment
router.post('/appointments', appointmentController.createAppointment);

// Get all appointments
router.get('/appointmentfindall', appointmentController.getAllAppointments);

// Get appointment statistics
router.get('/appointments/stats', appointmentController.getAppointmentStats);

// Get today's appointments
router.get('/appointments/today', appointmentController.getTodaysAppointments);

// Update appointment status (PATCH for partial update)
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);

// UPDATE FULL APPOINTMENT - ADD THIS ROUTE
router.put('/appointments/:id', appointmentController.updateAppointment);

// Delete/cancel appointment
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;