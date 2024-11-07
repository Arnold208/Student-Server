// routes/students.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               course:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       500:
 *         description: Database error
 */
router.post('/', async (req, res) => {
    const { name, age, course, gender } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students (name, age, course, gender) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, age, course, gender]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retrieve a list of students
 *     responses:
 *       200:
 *         description: A list of students
 *       500:
 *         description: Database error
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retrieve a single student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A student object
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               course:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, course, gender } = req.body;
    try {
        const result = await pool.query(
            'UPDATE students SET name = $1, age = $2, course = $3, gender = $4 WHERE id = $5 RETURNING *',
            [name, age, course, gender, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/gender/{gender}:
 *   get:
 *     summary: Retrieve a list of students by gender
 *     parameters:
 *       - in: path
 *         name: gender
 *         required: true
 *         schema:
 *           type: string
 *         description: The gender of the students to retrieve (e.g., 'male', 'female')
 *     responses:
 *       200:
 *         description: A list of students filtered by gender
 *       500:
 *         description: Database error
 */
router.get('/gender/:gender', async (req, res) => {
    const { gender } = req.params;
    try {
        const result = await pool.query('SELECT * FROM students WHERE gender = $1', [gender]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/course/{course}:
 *   get:
 *     summary: Retrieve a list of students by course
 *     parameters:
 *       - in: path
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: The course of the students to retrieve
 *     responses:
 *       200:
 *         description: A list of students filtered by course
 *       500:
 *         description: Database error
 */
router.get('/course/:course', async (req, res) => {
    const { course } = req.params;
    try {
        const result = await pool.query('SELECT * FROM students WHERE course = $1', [course]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /students/name/{name}:
 *   get:
 *     summary: Find a student by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the student to retrieve
 *     responses:
 *       200:
 *         description: A student object
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.get('/name/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query('SELECT * FROM students WHERE name = $1', [name]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
