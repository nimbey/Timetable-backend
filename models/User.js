const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin']
    },
    subject: {
        type: String,
        required: function() {
            return this.role === 'student' || this.role === 'teacher';
        }
    }
});

module.exports = mongoose.model('User', userSchema); 