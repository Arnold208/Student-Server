// config/dbInit.js
const pool = require('./db');

async function createStudentTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INTEGER NOT NULL,
            course VARCHAR(100) NOT NULL,
            gender VARCHAR(10) NOT NULL
        );
    `;

    try {
        await pool.query(query);
        console.log("Students table created successfully or already exists.");
    } catch (error) {
        console.error("Error creating students table:", error);
    }
}

module.exports = createStudentTable;
