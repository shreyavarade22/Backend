const PatientAdmission = require('./Admitpatientmodel');

// Search patients (from localStorage or database)
exports.searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search in admissions database
        const patients = await PatientAdmission.find({
            $or: [
                { patientName: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.status(200).json({
            success: true,
            data: patients
        });
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get available beds
exports.getAvailableBeds = async (req, res) => {
    try {
        const allBeds = [
            "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10",
            "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20"
        ];

        const occupiedBeds = await PatientAdmission.find({ 
            status: 'Admitted' 
        }).select('bedNo');

        const occupiedBedNumbers = occupiedBeds.map(adm => adm.bedNo);
        const availableBeds = allBeds.filter(bed => !occupiedBedNumbers.includes(bed));

        res.status(200).json({
            success: true,
            totalBeds: allBeds.length,
            occupiedBeds: occupiedBedNumbers.length,
            availableBeds: availableBeds.length,
            data: availableBeds
        });
    } catch (error) {
        console.error('Error fetching available beds:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all admissions
exports.getAllAdmissions = async (req, res) => {
    try {
        const admissions = await PatientAdmission.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: admissions.length,
            data: admissions
        });
    } catch (error) {
        console.error('Error fetching admissions:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get admission by ID
exports.getAdmissionById = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        res.status(200).json({
            success: true,
            data: admission
        });
    } catch (error) {
        console.error('Error fetching admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new admission
exports.createAdmission = async (req, res) => {
    try {
        const admissionData = req.body;
        
        // Check if bed is already occupied
        const existingAdmission = await PatientAdmission.findOne({
            bedNo: admissionData.bedNo,
            status: 'Admitted'
        });

        if (existingAdmission) {
            return res.status(400).json({
                success: false,
                message: `Bed ${admissionData.bedNo} is already occupied`
            });
        }

        const newAdmission = new PatientAdmission(admissionData);
        await newAdmission.save();

        res.status(201).json({
            success: true,
            message: 'Patient admitted successfully',
            data: newAdmission
        });
    } catch (error) {
        console.error('Error creating admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update admission
exports.updateAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        // If bed number is being changed, check if new bed is available
        if (req.body.bedNo && req.body.bedNo !== admission.bedNo && req.body.status === 'Admitted') {
            const bedOccupied = await PatientAdmission.findOne({
                bedNo: req.body.bedNo,
                status: 'Admitted',
                _id: { $ne: admission._id }
            });

            if (bedOccupied) {
                return res.status(400).json({
                    success: false,
                    message: `Bed ${req.body.bedNo} is already occupied`
                });
            }
        }

        const updatedAdmission = await PatientAdmission.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Admission updated successfully',
            data: updatedAdmission
        });
    } catch (error) {
        console.error('Error updating admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Discharge patient
exports.dischargePatient = async (req, res) => {
    try {
        const { dischargeDate, dischargeNotes, dischargeType } = req.body;
        
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        if (admission.status === 'Discharged') {
            return res.status(400).json({
                success: false,
                message: 'Patient is already discharged'
            });
        }

        admission.status = 'Discharged';
        admission.dischargeDate = dischargeDate;
        admission.dischargeNotes = dischargeNotes || '';
        admission.dischargeType = dischargeType || 'Recovered';
        
        await admission.save();

        res.status(200).json({
            success: true,
            message: 'Patient discharged successfully',
            data: admission
        });
    } catch (error) {
        console.error('Error discharging patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete admission
exports.deleteAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOneAndDelete({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admission deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};