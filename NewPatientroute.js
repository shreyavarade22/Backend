const express = require('express');
const router = express.Router();
const {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientStats
} = require('./NewPatientcontroller.js');

// Routes - REMOVED validation middleware temporarily for testing
router.post('/', registerPatient);
router.get('/', getAllPatients);
router.get('/stats', getPatientStats);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;