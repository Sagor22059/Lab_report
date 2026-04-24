const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Validation helper
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

router.get('/login', (req, res) => res.render('public/login', { error: null }));

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.render('public/login', { error: 'Email and password are required' });
    }
    
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.render('public/login', { error: 'Invalid credentials' });
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('public/login', { error: 'Invalid credentials' });
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        if (user.role === 'student') return res.redirect('/student/dashboard');
        if (user.role === 'teacher') return res.redirect('/teacher/dashboard');
        if (user.role === 'admin') return res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.render('public/login', { error: 'Database connection failed. Please try again.' });
    }
});

router.get('/register', (req, res) => res.render('public/register', { error: null }));

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
        return res.render('public/register', { error: 'All fields are required' });
    }
    
    if (!validateEmail(email)) {
        return res.render('public/register', { error: 'Invalid email format' });
    }
    
    if (!validatePassword(password)) {
        return res.render('public/register', { error: 'Password must be at least 6 characters long' });
    }
    
    if (!['student', 'teacher'].includes(role)) {
        return res.render('public/register', { error: 'Invalid role selected' });
    }
    
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.render('public/register', { error: 'Email already exists. Please use another email.' });
        } else if (err.code === 'ECONNREFUSED') {
            res.render('public/register', { error: 'Database connection failed. Please try again later.' });
        } else {
            res.render('public/register', { error: 'Registration failed. Please try again.' });
        }
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;