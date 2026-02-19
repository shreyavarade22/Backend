// @ts-ignore - VS Code TypeScript warning ignore
const PatientAdmission = require('./Patientmodel');

// @desc    Get all admissions
const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await PatientAdmission.find().sort({ createdAt: -1 });
        
        const total = admissions.length;
        const admitted = admissions.filter(a => a.status === 'Admitted').length;
        const discharged = admissions.filter(a => a.status === 'Discharged').length;
        
        res.json({
            success: true,
            data: admissions,
            stats: {
                total,
                admitted,
                discharged
            }
        });
    } catch (error) {
        console.error('Error in getAllAdmissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admissions',
            error: error.message
        });
    }
};

// @desc    Create new admission
const createAdmission = async (req, res) => {
    try {
        const admissionData = req.body;
        
        // Check if bed is already occupied
        const occupiedBed = await PatientAdmission.findOne({
            bedNo: admissionData.bedNo,
            status: 'Admitted'
        });
        
        if (occupiedBed) {
            return res.status(400).json({
                success: false,
                message: `Bed ${admissionData.bedNo} is already occupied`
            });
        }
        
        const admission = new PatientAdmission(admissionData);
        await admission.save();
        
        res.status(201).json({
            success: true,
            data: admission,
            message: `✅ Patient ${admissionData.patientName} admitted to Bed ${admissionData.bedNo}`
        });
    } catch (error) {
        console.error('Error in createAdmission:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admission',
            error: error.message
        });
    }
};

// @desc    Get single admission by ID
const getAdmissionById = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }
        
        res.json({
            success: true,
            data: admission
        });
    } catch (error) {
        console.error('Error in getAdmissionById:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admission',
            error: error.message
        });
    }
};

// @desc    Update admission
const updateAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }
        
        res.json({
            success: true,
            data: admission,
            message: '✅ Admission updated successfully'
        });
    } catch (error) {
        console.error('Error in updateAdmission:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating admission',
            error: error.message
        });
    }
};

// @desc    Discharge patient
const dischargePatient = async (req, res) => {
    try {
        const { dischargeDate, dischargeNotes, dischargeType } = req.body;
        
        const admission = await PatientAdmission.findOneAndUpdate(
            { id: req.params.id },
            {
                status: 'Discharged',
                dischargeDate,
                dischargeNotes,
                dischargeType
            },
            { new: true }
        );
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }
        
        res.json({
            success: true,
            data: admission,
            message: `✅ Patient ${admission.patientName} discharged successfully`
        });
    } catch (error) {
        console.error('Error in dischargePatient:', error);
        res.status(500).json({
            success: false,
            message: 'Error discharging patient',
            error: error.message
        });
    }
};

// @desc    Delete admission
const deleteAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOneAndDelete({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }
        
        res.json({
            success: true,
            message: '✅ Admission deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteAdmission:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting admission',
            error: error.message
        });
    }
};

// @desc    Get available beds
const getAvailableBeds = async (req, res) => {
    try {
        const allBeds = Array.from({ length: 20 }, (_, i) => `B${i + 1}`);
        
        const occupiedAdmissions = await PatientAdmission.find({ status: 'Admitted' });
        const occupiedBeds = occupiedAdmissions.map(adm => adm.bedNo);
        
        const availableBeds = allBeds.filter(bed => !occupiedBeds.includes(bed));
        
        res.json({
            success: true,
            data: {
                availableBeds,
                occupiedBeds,
                totalBeds: allBeds.length,
                availableCount: availableBeds.length,
                occupiedCount: occupiedBeds.length
            }
        });
    } catch (error) {
        console.error('Error in getAvailableBeds:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available beds',
            error: error.message
        });
    }
};

// @desc    Search patients
const searchPatients = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({ success: true, data: [] });
        }
        
        const patients = await PatientAdmission.find({
            $or: [
                { patientName: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } },
                { patientId: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);
        
        res.json({
            success: true,
            data: patients
        });
    } catch (error) {
        console.error('Error in searchPatients:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching patients',
            error: error.message
        });
    }
};

module.exports = {
    getAllAdmissions,
    createAdmission,
    getAdmissionById,
    updateAdmission,
    dischargePatient,
    deleteAdmission,
    getAvailableBeds,
    searchPatients
};