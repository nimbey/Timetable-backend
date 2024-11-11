const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TimeSlot = require('../models/TimeSlot');

// GET /api/timetable
router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching timetable data...');
        
        // Simply fetch all timeslots without population
        const slots = await TimeSlot.find()
            .sort({ day: 1, startTime: 1 })
            .lean();

        console.log('Found slots:', slots);

        // Transform data into day-based structure
        const timetableData = {
            monday: { time: 'N/A', subject: 'No Class', teacher: 'N/A', room: 'N/A' },
            tuesday: { time: 'N/A', subject: 'No Class', teacher: 'N/A', room: 'N/A' },
            wednesday: { time: 'N/A', subject: 'No Class', teacher: 'N/A', room: 'N/A' },
            thursday: { time: 'N/A', subject: 'No Class', teacher: 'N/A', room: 'N/A' },
            friday: { time: 'N/A', subject: 'No Class', teacher: 'N/A', room: 'N/A' }
        };

        slots.forEach(slot => {
            const dayKey = slot.day.toLowerCase();
            timetableData[dayKey] = {
                time: `${slot.startTime} - ${slot.endTime}`,
                subject: slot.subject,
                teacher: slot.teacher,
                room: slot.room
            };
        });

        res.json(timetableData);
    } catch (error) {
        console.error('Timetable fetch error:', error);
        res.status(500).json({ message: 'Error fetching timetable' });
    }
});

// Get teacher's schedule
router.get('/teacher', auth, async (req, res) => {
    try {
        // Only return slots where the teacher name matches
        const slots = await TimeSlot.find({ 
            teacher: req.user.name 
        }).sort({ 
            day: 1, 
            startTime: 1 
        });
        
        res.json(slots);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student's schedule
router.get('/student', auth, async (req, res) => {
    try {
        console.log('User requesting schedule:', req.user); // Debug log
        
        if (!req.user.subject) {
            return res.status(400).json({ 
                message: 'No subject assigned to user' 
            });
        }

        const slots = await TimeSlot.find({ 
            subject: req.user.subject 
        }).sort({ 
            day: 1, 
            startTime: 1 
        });

        console.log('Found slots for subject:', req.user.subject, slots); // Debug log
        
        res.json(slots);
    } catch (error) {
        console.error('Error in student schedule:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all schedules
router.get('/all', auth, async (req, res) => {
    try {
        const slots = await TimeSlot.find().sort({ 
            day: 1, 
            startTime: 1 
        });
        
        res.json(slots);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 