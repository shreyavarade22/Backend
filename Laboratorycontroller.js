const Laboratory = require('./Laboratorymodel');

// ==================== CREATE LAB PATIENT ====================
exports.createLabPatient = async (req, res) => {
    try {
        const labData = req.body;
        
        // Generate test ID
        const testId = `LAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const newLabPatient = new Laboratory({
            ...labData,
            testId,
            testDate: new Date().toISOString().split('T')[0],
            testTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        });
        
        await newLabPatient.save();

        res.status(201).json({
            success: true,
            message: 'Patient added to laboratory successfully',
            data: newLabPatient
        });
    } catch (error) {
        console.error('Error creating lab patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET ALL LAB PATIENTS ====================
exports.getAllLabPatients = async (req, res) => {
    try {
        const labPatients = await Laboratory.find().sort({ createdAt: -1 });
        
        // Group by test type
        const groupedByTest = {
            "2D-Echocardiogram": labPatients.filter(p => p.testName === "2D-Echocardiogram"),
            "Electrocardiogram": labPatients.filter(p => p.testName === "Electrocardiogram"),
            "Treadmill Test": labPatients.filter(p => p.testName === "Treadmill Test")
        };
        
        // Calculate statistics
        const total = labPatients.length;
        const male = labPatients.filter(p => p.gender === 'Male').length;
        const female = labPatients.filter(p => p.gender === 'Female').length;
        const pending = labPatients.filter(p => p.status === 'Pending').length;
        const completed = labPatients.filter(p => p.status === 'Completed').length;

        res.status(200).json({
            success: true,
            count: total,
            groupedByTest,
            stats: {
                total,
                male,
                female,
                pending,
                completed
            }
        });
    } catch (error) {
        console.error('Error fetching lab patients:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET PATIENTS BY TEST TYPE ====================
exports.getPatientsByTestType = async (req, res) => {
    try {
        const { testType } = req.params;
        
        const validTests = ['2D-Echocardiogram', 'Electrocardiogram', 'Treadmill Test'];
        
        if (!validTests.includes(testType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid test type'
            });
        }
        
        const patients = await Laboratory.find({ testName: testType }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            testType,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('Error fetching patients by test type:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET SINGLE LAB PATIENT ====================
exports.getLabPatientById = async (req, res) => {
    try {
        const patient = await Laboratory.findById(req.params.id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Laboratory patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('Error fetching lab patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE LAB PATIENT ====================
exports.updateLabPatient = async (req, res) => {
    try {
        const patient = await Laboratory.findById(req.params.id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Laboratory patient not found'
            });
        }

        const updatedPatient = await Laboratory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Laboratory patient updated successfully',
            data: updatedPatient
        });
    } catch (error) {
        console.error('Error updating lab patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE TEST RESULTS ====================
exports.updateTestResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { results, status } = req.body;
        
        const patient = await Laboratory.findById(id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Laboratory patient not found'
            });
        }

        const updateData = {
            results: { ...patient.results, ...results }
        };
        
        if (status) {
            updateData.status = status;
        }
        
        if (status === 'Completed' && !patient.reportGenerated) {
            updateData.reportGenerated = true;
            updateData.reportDate = new Date().toISOString().split('T')[0];
        }

        const updatedPatient = await Laboratory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Test results updated successfully',
            data: updatedPatient
        });
    } catch (error) {
        console.error('Error updating test results:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DELETE LAB PATIENT ====================
exports.deleteLabPatient = async (req, res) => {
    try {
        const patient = await Laboratory.findByIdAndDelete(req.params.id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Laboratory patient not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Laboratory patient deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting lab patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET LABORATORY STATISTICS ====================
exports.getLaboratoryStats = async (req, res) => {
    try {
        const total = await Laboratory.countDocuments();
        const male = await Laboratory.countDocuments({ gender: 'Male' });
        const female = await Laboratory.countDocuments({ gender: 'Female' });
        const pending = await Laboratory.countDocuments({ status: 'Pending' });
        const completed = await Laboratory.countDocuments({ status: 'Completed' });
        
        // Count by test type
        const echoCount = await Laboratory.countDocuments({ testName: '2D-Echocardiogram' });
        const ecgCount = await Laboratory.countDocuments({ testName: 'Electrocardiogram' });
        const tmtCount = await Laboratory.countDocuments({ testName: 'Treadmill Test' });

        res.status(200).json({
            success: true,
            data: {
                total,
                male,
                female,
                pending,
                completed,
                byTestType: {
                    echocardiogram: echoCount,
                    electrocardiogram: ecgCount,
                    treadmill: tmtCount
                }
            }
        });
    } catch (error) {
        console.error('Error fetching laboratory statistics:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};