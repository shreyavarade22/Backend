const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    patientId: {
        type: String,
        default: ''
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
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
    nameOfKin: {
        type: String,
        default: ''
    },
    kinContact: {
        type: String,
        default: ''
    },
    bedNo: {
        type: String,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        default: ''
    },
    symptoms: [{
        type: String
    }],
    admittingDoctor: {
        type: String,
        default: ''
    },
    admissionDate: {
        type: String,
        required: true
    },
    admissionTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged'],
        default: 'Admitted'
    },
    dischargeDate: {
        type: String,
        default: ''
    },
    dischargeNotes: {
        type: String,
        default: ''
    },
    dischargeType: {
        type: String,
        enum: ['', 'Recovered', 'Referred', 'LAMA', 'Expired'],
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PatientAdmission', admissionSchema);