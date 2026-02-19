const Patient = require('./NewPatientmodel.js');

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Public
const registerPatient = async (req, res) => {
    try {
        console.log("=".repeat(50));
        console.log("📝 REGISTERING NEW PATIENT");
        console.log("=".repeat(50));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        
        const { phone, email } = req.body;

        // Check if patient already exists
        const existingPatient = await Patient.findOne({
            $or: [{ phone }, { email }]
        });

        if (existingPatient) {
            console.log("❌ Patient already exists:", { phone, email });
            return res.status(400).json({
                success: false,
                message: 'Patient with this phone or email already exists'
            });
        }

        // Create new patient
        const patient = await Patient.create(req.body);

        console.log("✅ Patient registered successfully!");
        console.log("Patient ID:", patient._id);
        console.log("Patient Name:", patient.patientName);
        console.log("=".repeat(50));

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });
    } catch (error) {
        console.error("❌ Registration error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
const getAllPatients = async (req, res) => {
    try {
        console.log("📋 FETCHING ALL PATIENTS");
        
        const { search, page = 1, limit = 10 } = req.query;
        let query = {};

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = {
                $or: [
                    { patientName: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                    { bloodGroup: searchRegex },
                    { gender: searchRegex },
                    { profession: searchRegex },
                    { symptoms: { $in: [searchRegex] } }
                ]
            };
        }

        const patients = await Patient.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Patient.countDocuments(query);

        // Get statistics
        const stats = {
            total: await Patient.countDocuments(),
            male: await Patient.countDocuments({ gender: 'Male' }),
            female: await Patient.countDocuments({ gender: 'Female' }),
            other: await Patient.countDocuments({ gender: 'Other' }),
            active: await Patient.countDocuments({ status: 'Active' })
        };

        console.log(`✅ Found ${patients.length} patients (Total: ${total})`);

        res.status(200).json({
            success: true,
            count: patients.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            stats,
            data: patients
        });
    } catch (error) {
        console.error("❌ Error fetching patients:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Public
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

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
        console.error("❌ Error fetching patient:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Public
const updatePatient = async (req, res) => {
    try {
        // Check if phone or email already exists for other patients
        if (req.body.phone || req.body.email) {
            const existingPatient = await Patient.findOne({
                $and: [
                    { _id: { $ne: req.params.id } },
                    {
                        $or: [
                            { phone: req.body.phone },
                            { email: req.body.email }
                        ]
                    }
                ]
            });

            if (existingPatient) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone or email already in use by another patient'
                });
            }
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        console.log("✅ Patient updated successfully:", patient._id);

        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: patient
        });
    } catch (error) {
        console.error("❌ Update error:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Public
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        console.log("✅ Patient deleted successfully:", req.params.id);

        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error("❌ Delete error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats
// @access  Public
const getPatientStats = async (req, res) => {
    try {
        const stats = {
            total: await Patient.countDocuments(),
            male: await Patient.countDocuments({ gender: 'Male' }),
            female: await Patient.countDocuments({ gender: 'Female' }),
            other: await Patient.countDocuments({ gender: 'Other' }),
            active: await Patient.countDocuments({ status: 'Active' })
        };

        // Get blood group statistics
        const bloodGroupStats = await Patient.aggregate([
            {
                $group: {
                    _id: '$bloodGroup',
                    count: { $sum: 1 }
                }
            }
        ]);

        const bloodGroups = {};
        bloodGroupStats.forEach(item => {
            bloodGroups[item._id] = item.count;
        });
        stats.bloodGroups = bloodGroups;

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("❌ Stats error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientStats
};