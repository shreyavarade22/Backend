const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Receptionist', 'Doctor'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signup',
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'logins'
});

module.exports = mongoose.model('Login', loginSchema);