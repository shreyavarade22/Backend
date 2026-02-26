const express = require('express');
const router = express.Router();
const patientController = require('./Admitpatientcontroller');

// Patient routes
router.get('/patients/search', patientController.searchPatients);
router.get('/availablebeds', patientController.getAvailableBeds);
router.get('/admitpatient', patientController.getAllAdmissions);
router.get('/admitpatient/:id', patientController.getAdmissionById);
router.post('/admitpatient', patientController.createAdmission);
router.put('/admitpatient/:id', patientController.updateAdmission);
router.patch('/dischargepatient/:id', patientController.dischargePatient);
router.delete('/admitpatient/:id', patientController.deleteAdmission);

// Statistics route
router.get('/admissionstats', async (req, res) => {
    try {
        const total = await PatientAdmission.countDocuments();
        const admitted = await PatientAdmission.countDocuments({ status: 'Admitted' });
        const discharged = await PatientAdmission.countDocuments({ status: 'Discharged' });

        res.status(200).json({
            success: true,
            data: {
                total,
                admitted,
                discharged
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;