const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { isAuthenticated, hasRole } = require('../middleware/auth');
const router = express.Router();

router.use(isAuthenticated, hasRole(['admin']));

router.get('/dashboard', async (req, res) => {
    const [[{ count: userCount }]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[{ count: subCount }]] = await db.query('SELECT COUNT(*) as count FROM submissions');
    res.render('admin/dashboard', { userCount, submissionCount: subCount });
});

router.get('/users', async (req, res) => {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.render('admin/manage_users', { users });
});

router.post('/users', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
    res.redirect('/admin/users');
});

router.get('/users/delete/:id', async (req, res) => {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect('/admin/users');
});

router.get('/courses', async (req, res) => {
    const [courses] = await db.query(`
        SELECT c.*, u.name as teacher_name FROM courses c
        JOIN users u ON c.teacher_id = u.id
    `);
    const [teachers] = await db.query('SELECT id, name FROM users WHERE role = "teacher"');
    res.render('admin/manage_courses', { courses, teachers });
});

router.post('/courses', async (req, res) => {
    const { course_name, teacher_id } = req.body;
    await db.query('INSERT INTO courses (course_name, teacher_id) VALUES (?, ?)', [course_name, teacher_id]);
    res.redirect('/admin/courses');
});

module.exports = router;