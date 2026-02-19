const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [120, 'Age cannot exceed 120']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^[789]\d{9}$/.test(v);
            },
            message: 'Phone number must be 10 digits starting with 7, 8, or 9'
        }
    },
    alternatePhone: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /^[789]\d{9}$/.test(v);
            },
            message: 'Alternate phone must be 10 digits starting with 7, 8, or 9'
        }
    },
    address: {
        type: String,
        trim: true
    },
    symptoms: [{
        type: String
    }],
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    profession: {
        type: String,
        trim: true
    },
    nameOfKin: {
        type: String,
        trim: true
    },
    kinContact: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /^[789]\d{9}$/.test(v);
            },
            message: 'Emergency contact must be 10 digits starting with 7, 8, or 9'
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Discharged'],
        default: 'Active'
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    registeredTime: {
        type: String
    }
}, {
    timestamps: true
});

// Pre-save middleware to set registeredTime
patientSchema.pre('save', function(next) {
    if (!this.registeredTime) {
        const now = new Date();
        this.registeredTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    }
    next();
});

// Method to get patient's age from DOB
patientSchema.methods.calculateAge = function() {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Virtual for formatted registered date
patientSchema.virtual('formattedRegisteredDate').get(function() {
    return this.registeredDate.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);