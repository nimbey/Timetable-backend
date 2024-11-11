const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

courseSchema.virtual('timeslots', {
    ref: 'TimeSlot',
    localField: '_id',
    foreignField: 'course'
});

module.exports = mongoose.model('Course', courseSchema); 