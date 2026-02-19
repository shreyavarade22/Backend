const express = require('express');
const router = express.Router();
const patientController = require('./Patientcontroller'); // Added .js extension

// Patient routes
router.get('/patients/search', patientController.searchPatients);
router.get('/patients/available-beds', patientController.getAvailableBeds);
router.get('/patients', patientController.getAllAdmissions);
router.get('/patients/:id', patientController.getAdmissionById);
router.post('/patients', patientController.createAdmission);
router.put('/patients/:id', patientController.updateAdmission);
router.put('/patients/:id/discharge', patientController.dischargePatient);
router.delete('/patients/:id', patientController.deleteAdmission);

module.exports = router;