const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); [cite: 41]
app.use(express.json());

// Database Connection Pool gamit ang mysql2 promise-based [cite: 38, 39]
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 1. Get all student records [cite: 28]
app.get('/students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_student');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get a single student record [cite: 29]
app.get('/students/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_student WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Add a new student [cite: 30]
app.post('/students', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_student (firstname, lastname, gender, age, course_id, department_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstname, lastname, gender, age, course_id, department_id, status]
        );
        res.status(201).json({ id: result.insertId, message: "Student added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update student information [cite: 31]
app.put('/students/:id', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    try {
        await db.query(
            'UPDATE tbl_student SET firstname=?, lastname=?, gender=?, age=?, course_id=?, department_id=?, status=? WHERE id=?',
            [firstname, lastname, gender, age, course_id, department_id, status, req.params.id]
        );
        res.json({ message: "Student updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update student status only [cite: 32]
app.patch('/students/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE tbl_student SET status=? WHERE id=?', [status, req.params.id]);
        res.json({ message: "Student status updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Delete a student record [cite: 33]
app.delete('/students/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM tbl_student WHERE id = ?', [req.params.id]);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});