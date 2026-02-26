const express = require('express');
const router = express.Router();
const laboratoryController = require('./Laboratorycontroller');

// ==================== LABORATORY ROUTES ====================

// CREATE new laboratory patient
router.post('/laboratory', laboratoryController.createLabPatient);

// GET all laboratory patients (grouped by test)
router.get('/laboratory', laboratoryController.getAllLabPatients);

// GET laboratory statistics
router.get('/laboratory/stats', laboratoryController.getLaboratoryStats);

// GET patients by test type (2D-Echo, ECG, TMT)
router.get('/laboratory/test/:testType', laboratoryController.getPatientsByTestType);

// GET single laboratory patient
router.get('/laboratory/:id', laboratoryController.getLabPatientById);

// UPDATE laboratory patient
router.put('/laboratory/:id', laboratoryController.updateLabPatient);

// UPDATE test results only
router.patch('/laboratory/:id/results', laboratoryController.updateTestResults);

// DELETE laboratory patient
router.delete('/laboratory/:id', laboratoryController.deleteLabPatient);

module.exports = router;