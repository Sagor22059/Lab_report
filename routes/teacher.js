const express = require('express');
const db = require('../db');
const { isAuthenticated, hasRole } = require('../middleware/auth');
const router = express.Router();

router.use(isAuthenticated, hasRole(['teacher']));

router.get('/dashboard', async (req, res) => {
    const teacherId = req.session.user.id;
    try {
        const [assignments] = await db.query(`
            SELECT a.*, c.course_name, (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submission_count
            FROM assignments a JOIN courses c ON a.course_id = c.id
            WHERE c.teacher_id = ?
        `, [teacherId]);
        res.render('teacher/dashboard', { assignments });
    } catch (err) { res.send('Error'); }
});

router.get('/create-assignment', async (req, res) => {
    const teacherId = req.session.user.id;
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE teacher_id = ?', [teacherId]);
        res.render('teacher/create_assignment', { courses, error: null });
    } catch (err) { res.send('Error'); }
});

router.post('/create-assignment', async (req, res) => {
    const { course_id, title, description, deadline } = req.body;
    try {
        await db.query('INSERT INTO assignments (course_id, title, description, deadline) VALUES (?, ?, ?, ?)',
            [course_id, title, description, deadline]);
        res.redirect('/teacher/dashboard');
    } catch (err) { res.render('teacher/create_assignment', { courses: [], error: 'Failed' }); }
});

router.get('/submissions/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;
    try {
        const [submissions] = await db.query(`
            SELECT s.*, u.name as student_name, g.marks, g.feedback
            FROM submissions s
            JOIN users u ON s.student_id = u.id
            LEFT JOIN grades g ON s.id = g.submission_id
            WHERE s.assignment_id = ?
        `, [assignmentId]);
        const [assignment] = await db.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
        res.render('teacher/submissions', { submissions, assignment });
    } catch (err) { res.send('Error'); }
});

router.get('/grade/:submissionId', async (req, res) => {
    const { submissionId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT s.*, u.name as student_name, a.title as assignment_title
            FROM submissions s
            JOIN users u ON s.student_id = u.id
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.id = ?
        `, [submissionId]);
        res.render('teacher/grade', { submission: rows[0] });
    } catch (err) { res.send('Error'); }
});

router.post('/grade/:submissionId', async (req, res) => {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM grades WHERE submission_id = ?', [submissionId]);
        if (existing.length) {
            await db.query('UPDATE grades SET marks = ?, feedback = ? WHERE submission_id = ?', [marks, feedback, submissionId]);
        } else {
            await db.query('INSERT INTO grades (submission_id, marks, feedback) VALUES (?, ?, ?)', [submissionId, marks, feedback]);
        }
        await db.query('UPDATE submissions SET status = "graded" WHERE id = ?', [submissionId]);
        res.redirect('/teacher/dashboard');
    } catch (err) { res.send('Error saving grade'); }
});

module.exports = router;