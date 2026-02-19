const mongoose = require('mongoose');

const patientAdmissionSchema = new mongoose.Schema({
    // Admission ID
    id: {
        type: String,
        required: true,
        unique: true
    },
    
    // Patient Information
    patientName: {
        type: String,
        required: true
    },
    patientId: {
        type: String
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    address: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    
    // Emergency Contact
    nameOfKin: {
        type: String
    },
    kinContact: {
        type: String
    },
    
    // Admission Details
    bedNo: {
        type: String,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String
    },
    symptoms: [{
        type: String
    }],
    admittingDoctor: {
        type: String
    },
    
    // System Fields
    admissionDate: {
        type: String
    },
    admissionTime: {
        type: String
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged'],
        default: 'Admitted'
    },
    
    // Discharge Information
    dischargeDate: {
        type: String
    },
    dischargeNotes: {
        type: String
    },
    dischargeType: {
        type: String,
        enum: ['Recovered', 'Referred', 'LAMA', 'Expired', '']
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
patientAdmissionSchema.index({ patientName: 'text', phone: 'text', bedNo: 'text' });

module.exports = mongoose.model('PatientAdmission', patientAdmissionSchema);