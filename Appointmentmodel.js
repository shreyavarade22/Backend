const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `APT-${year}${month}${day}-${random}`;
        }
    },
    patientName: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [1, "Age must be at least 1"],
        max: [120, "Age cannot exceed 120"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: "Phone number must be 10 digits"
        }
    },
    email: {  // ✅ ADDED - Missing field!
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    symptoms: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: [true, "Appointment date is required"]
    },
    time: {
        type: String,
        required: [true, "Appointment time is required"]
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    type: {
        type: String,
        default: 'Cardiology'
    },
    doctor: {
        type: String,
        default: 'Dr. Pranjal Patil'
    },
    notes: {
        type: String,
        default: ''
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'appointments'
});

// ✅ ADDED: Compound index to prevent duplicate date+time
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);