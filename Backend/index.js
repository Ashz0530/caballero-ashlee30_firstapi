const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/students', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM tbl_student');
    res.json(rows);
});

app.get('/students/:id', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM tbl_student WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
});

app.post('/students', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    await db.query('INSERT INTO tbl_student (firstname, lastname, gender, age, course_id, department_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [firstname, lastname, gender, age, course_id, department_id, status]);
    res.json({ message: "Student added!" });
});

app.put('/students/:id', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    await db.query('UPDATE tbl_student SET firstname=?, lastname=?, gender=?, age=?, course_id=?, department_id=?, status=? WHERE id=?', 
    [firstname, lastname, gender, age, course_id, department_id, status, req.params.id]);
    res.json({ message: "Student updated!" });
});

app.patch('/students/status/:id', async (req, res) => {
    const { status } = req.body;
    await db.query('UPDATE tbl_student SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: "Status updated!" });
});

app.delete('/students/:id', async (req, res) => {
    await db.query('DELETE FROM tbl_student WHERE id=?', [req.params.id]);
    res.json({ message: "Student deleted!" });
});

app.listen(3000, () => console.log('Server running on port 3000'));