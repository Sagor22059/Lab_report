const express = require('express');
const db = require('../db');
const { isAuthenticated, hasRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.use(isAuthenticated, hasRole(['student']));

router.get('/dashboard', async (req, res) => {
    const studentId = req.session.user.id;
    try {
        const [assignments] = await db.query(`
            SELECT a.*, c.course_name FROM assignments a
            JOIN courses c ON a.course_id = c.id
            WHERE a.deadline > NOW() ORDER BY a.deadline ASC
        `);
        const [submissions] = await db.query(`
            SELECT s.*, a.title, g.marks FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            LEFT JOIN grades g ON s.id = g.submission_id
            WHERE s.student_id = ? ORDER BY s.submission_date DESC LIMIT 5
        `, [studentId]);
        res.render('student/dashboard', { assignments, submissions });
    } catch (err) { res.send('Error'); }
});

router.get('/upload', async (req, res) => {
    try {
        const [assignments] = await db.query(`
            SELECT a.*, c.course_name FROM assignments a
            JOIN courses c ON a.course_id = c.id
            WHERE a.deadline > NOW()
        `);
        res.render('student/upload', { assignments, error: null });
    } catch (err) { res.send('Error'); }
});

router.post('/upload', upload.single('report'), async (req, res) => {
    const { assignment_id } = req.body;
    const studentId = req.session.user.id;
    if (!req.file) return res.render('student/upload', { assignments: [], error: 'No file' });
    try {
        const [ass] = await db.query('SELECT deadline FROM assignments WHERE id = ?', [assignment_id]);
        const deadline = new Date(ass[0].deadline);
        const status = new Date() > deadline ? 'late' : 'submitted';
        const [existing] = await db.query('SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?', [assignment_id, studentId]);
        if (existing.length > 0) return res.render('student/upload', { assignments: [], error: 'Already submitted' });
        await db.query(
            'INSERT INTO submissions (assignment_id, student_id, file_path, original_filename, status) VALUES (?, ?, ?, ?, ?)',
            [assignment_id, studentId, req.file.path, req.file.originalname, status]
        );
        res.redirect('/student/submissions');
    } catch (err) { res.render('student/upload', { assignments: [], error: 'Submission failed' }); }
});

router.get('/submissions', async (req, res) => {
    const studentId = req.session.user.id;
    try {
        const [submissions] = await db.query(`
            SELECT s.*, a.title, g.marks, g.feedback FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            LEFT JOIN grades g ON s.id = g.submission_id
            WHERE s.student_id = ? ORDER BY s.submission_date DESC
        `, [studentId]);
        res.render('student/submissions', { submissions });
    } catch (err) { res.send('Error'); }
});

router.get('/feedback', async (req, res) => {
    const studentId = req.session.user.id;
    try {
        const [feedback] = await db.query(`
            SELECT a.title, g.marks, g.feedback, g.graded_at FROM grades g
            JOIN submissions s ON g.submission_id = s.id
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.student_id = ? ORDER BY g.graded_at DESC
        `, [studentId]);
        res.render('student/feedback', { feedback });
    } catch (err) { res.send('Error'); }
});

module.exports = router;