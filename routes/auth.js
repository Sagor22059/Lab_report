const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.get('/login', (req, res) => res.render('public/login', { error: null }));

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
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
        res.render('public/login', { error: 'Server error' });
    }
});

router.get('/register', (req, res) => res.render('public/register', { error: null }));

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!['student', 'teacher'].includes(role)) {
        return res.render('public/register', { error: 'Invalid role' });
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
        res.redirect('/login');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') res.render('public/register', { error: 'Email already exists' });
        else res.render('public/register', { error: 'Registration failed' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;