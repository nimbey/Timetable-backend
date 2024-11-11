const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const TimeSlot = require('../models/TimeSlot');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all users
router.get('/users', [auth, adminAuth], async (req, res) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};
        
        const users = await User.find(query)
            .select('-password')
            .sort('name');
            
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Add new user
router.post('/users', auth, async (req, res) => {
    try {
        const { name, email, password, role, subject } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !subject) {
            return res.status(400).json({ 
                message: 'All fields are required including subject' 
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user with subject
        user = new User({
            name,
            email,
            password,
            role,
            subject
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
        // Log the created user for debugging
        console.log('Created user:', {
            name: user.name,
            email: user.email,
            role: user.role,
            subject: user.subject
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/users/:id', auth, async (req, res) => {
    try {
        console.log('Updating user with ID:', req.params.id);
        console.log('Update data:', req.body);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                subject: req.body.subject
            },
            { new: true }
        );

        if (!user) {
            console.log('User not found for update');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User updated successfully:', user);
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Timetable Management
// Get all timeslots
router.get('/timetable', [auth, adminAuth], async (req, res) => {
    try {
        const slots = await TimeSlot.find().sort('day startTime');
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching timetable' });
    }
});

// Add time slot route
router.post('/timetable', auth, async (req, res) => {
    try {
        console.log('Received slot data:', req.body); // Debug log

        const { day, startTime, endTime, subject, teacher, room } = req.body;

        // Validate required fields
        if (!day || !startTime || !endTime || !subject || !teacher || !room) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check for time slot conflicts
        const conflictingSlot = await TimeSlot.findOne({
            day,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ],
            room
        });

        if (conflictingSlot) {
            return res.status(400).json({ 
                message: 'Time slot conflicts with existing schedule' 
            });
        }

        // Create new time slot
        const timeSlot = new TimeSlot({
            day,
            startTime,
            endTime,
            subject,
            teacher,
            room
        });

        await timeSlot.save();
        
        console.log('Created time slot:', timeSlot); // Debug log

        res.status(201).json(timeSlot);
    } catch (error) {
        console.error('Error creating time slot:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update timeslot
router.put('/timetable/:id', [auth, adminAuth], async (req, res) => {
    try {
        await TimeSlot.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Timeslot updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating timeslot' });
    }
});

// Delete timeslot
router.delete('/timetable/:id', [auth, adminAuth], async (req, res) => {
    try {
        await TimeSlot.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timeslot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting timeslot' });
    }
});

// Get single user
router.get('/users/:id', auth, async (req, res) => {
    try {
        console.log('Fetching user with ID:', req.params.id);
        const user = await User.findById(req.params.id);
        
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Found user:', user);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new route to get all teachers
router.get('/teachers', auth, async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' })
            .select('name subject')
            .sort({ name: 1 });
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 