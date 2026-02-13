const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true, 'Full name is required'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    username: { 
        type: String, 
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3
    },
    mobileNumber: { 
        type: String, 
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[789]\d{9}$/.test(v);
            },
            message: 'Mobile number must be 10 digits starting with 7, 8, or 9'
        }
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6
    },
    confirmPassword: { 
        type: String, 
        required: [true, 'Confirm password is required']
    },
    role: {
        type: String,
        enum: ['Receptionist', 'Doctor'],
        default: 'Receptionist'
    }
}, {
    timestamps: true,
    collection: 'signups'
});

// Remove confirmPassword before saving
signupSchema.pre('save', function(next) {
    this.confirmPassword = undefined;
    next();
});

module.exports = mongoose.model('signup', signupSchema);