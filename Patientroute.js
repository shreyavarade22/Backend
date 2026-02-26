const express = require('express');
const router = express.Router();
const patientController = require('./Patientcontroller');

// Patient routes
router.get('/patients/search', patientController.searchPatients);
router.get('/patients', patientController.getAllPatients);
router.get('/patients/stats', patientController.getPatientStats);
router.get('/patients/:id', patientController.getPatientById);
router.post('/patients', patientController.createPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

module.exports = router;