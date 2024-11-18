const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('Current directory:', __dirname);
console.log('Env file path:', path.join(__dirname, '.env'));

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Log all env vars (be careful with this in production!)
console.log('Environment variables:', process.env);

const app = express();

// Connect to database
connectDB();

// CORS configuration
app.use(cors({
    origin: [
        'http://127.0.0.1:5501',
        'http://localhost:5501',
        'http://127.0.0.1:5502',
        'http://localhost:5502',
        'https://your-frontend-domain.onrender.com' // Add your frontend Render URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/timetable', require('./routes/timetable'));

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for origins: ${['http://127.0.0.1:5501', 'http://localhost:5501']}`);
});

// MongoDB connection listeners
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
}); 