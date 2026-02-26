const Patient = require('./Patientmodel');

// ==================== CREATE PATIENT ====================
exports.createPatient = async (req, res) => {
    try {
        const patientData = req.body;
        
        // Check for duplicate patient (by phone or email)
        const existingPatient = await Patient.findOne({
            $or: [
                { phone: patientData.phone },
                { email: patientData.email }
            ]
        });

        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Patient with this phone or email already exists'
            });
        }

        const newPatient = new Patient(patientData);
        await newPatient.save();

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: newPatient
        });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET ALL PATIENTS ====================
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        
        // Calculate statistics
        const total = patients.length;
        const male = patients.filter(p => p.gender === 'Male').length;
        const female = patients.filter(p => p.gender === 'Female').length;
        const other = patients.filter(p => p.gender === 'Other').length;

        res.status(200).json({
            success: true,
            count: total,
            data: patients,
            stats: {
                total,
                male,
                female,
                other
            }
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET SINGLE PATIENT ====================
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({ id: req.params.id });
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE PATIENT ====================
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({ id: req.params.id });
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Check for duplicate phone/email if they're being changed
        if (req.body.phone || req.body.email) {
            const duplicateQuery = {
                _id: { $ne: patient._id },
                $or: []
            };
            
            if (req.body.phone) duplicateQuery.$or.push({ phone: req.body.phone });
            if (req.body.email) duplicateQuery.$or.push({ email: req.body.email });
            
            if (duplicateQuery.$or.length > 0) {
                const existingPatient = await Patient.findOne(duplicateQuery);
                if (existingPatient) {
                    return res.status(400).json({
                        success: false,
                        message: 'Patient with this phone or email already exists'
                    });
                }
            }
        }

        const updatedPatient = await Patient.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: updatedPatient
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DELETE PATIENT ====================
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({ id: req.params.id });
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== SEARCH PATIENTS ====================
exports.searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(query, 'i');
        
        const patients = await Patient.find({
            $or: [
                { patientName: searchRegex },
                { phone: searchRegex },
                { email: searchRegex },
                { gender: searchRegex },
                { bloodGroup: searchRegex },
                { profession: searchRegex },
                { symptoms: { $in: [searchRegex] } }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            count: patients.length,
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

// ==================== GET PATIENT STATISTICS ====================
exports.getPatientStats = async (req, res) => {
    try {
        const total = await Patient.countDocuments();
        const male = await Patient.countDocuments({ gender: 'Male' });
        const female = await Patient.countDocuments({ gender: 'Female' });
        const other = await Patient.countDocuments({ gender: 'Other' });
        const active = await Patient.countDocuments({ status: 'Active' });

        // Blood group distribution
        const bloodGroups = {};
        const bloodGroupList = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        
        for (const bg of bloodGroupList) {
            bloodGroups[bg] = await Patient.countDocuments({ bloodGroup: bg });
        }

        res.status(200).json({
            success: true,
            data: {
                total,
                male,
                female,
                other,
                active,
                bloodGroups
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};