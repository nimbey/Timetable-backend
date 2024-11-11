const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const TimeSlot = require('./models/TimeSlot');
require('dotenv').config();

const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        
        console.log('Clearing existing data...');
        await TimeSlot.deleteMany({});

        console.log('Creating new timetable slots...');
        
        // Clear existing data
        await User.deleteMany();
        await TimeSlot.deleteMany();

        console.log('Creating users...');
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const teacherPass = await bcrypt.hash('teacher123', salt);
        const studentPass = await bcrypt.hash('student123', salt);

        // Create users
        const users = await User.create([
            // Admins
            {
                email: 'admin1@school.com',
                password: adminPass,
                role: 'admin',
                name: 'Admin One'
            },
            {
                email: 'admin2@school.com',
                password: adminPass,
                role: 'admin',
                name: 'Admin Two'
            },
            // Teachers
            {
                email: 'math.teacher@school.com',
                password: teacherPass,
                role: 'teacher',
                name: 'John Smith',
                subject: 'Mathematics'
            },
            {
                email: 'physics.teacher@school.com',
                password: teacherPass,
                role: 'teacher',
                name: 'Jane Doe',
                subject: 'Physics'
            },
            {
                email: 'cs.teacher@school.com',
                password: teacherPass,
                role: 'teacher',
                name: 'Bob Wilson',
                subject: 'Computer Science'
            },
            // Students
            {
                email: 'math.student1@school.com',
                password: studentPass,
                role: 'student',
                name: 'Math Student One',
                subject: 'Mathematics'
            },
            {
                email: 'math.student2@school.com',
                password: studentPass,
                role: 'student',
                name: 'Math Student Two',
                subject: 'Mathematics'
            },
            {
                email: 'physics.student1@school.com',
                password: studentPass,
                role: 'student',
                name: 'Physics Student One',
                subject: 'Physics'
            },
            {
                email: 'physics.student2@school.com',
                password: studentPass,
                role: 'student',
                name: 'Physics Student Two',
                subject: 'Physics'
            },
            {
                email: 'cs.student1@school.com',
                password: studentPass,
                role: 'student',
                name: 'CS Student One',
                subject: 'Computer Science'
            },
            {
                email: 'cs.student2@school.com',
                password: studentPass,
                role: 'student',
                name: 'CS Student Two',
                subject: 'Computer Science'
            }
        ]);

        console.log('Creating timetable...');
        
        // Create timetable slots
        const slots = await TimeSlot.create([
            {
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Mathematics',
                teacher: 'John Smith',
                room: 'Room 101'
            },
            {
                day: 'Tuesday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Physics',
                teacher: 'Jane Doe',
                room: 'Room 102'
            },
            {
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Computer Science',
                teacher: 'Bob Wilson',
                room: 'Room 103'
            },
            {
                day: 'Thursday',
                startTime: '11:00',
                endTime: '12:30',
                subject: 'Mathematics',
                teacher: 'John Smith',
                room: 'Room 101'
            },
            {
                day: 'Friday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Physics',
                teacher: 'Jane Doe',
                room: 'Room 102'
            }
        ]);

        console.log('Created timetable slots:', slots);
        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();