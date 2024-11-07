// index.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerDocs = require('./config/swagger');
const studentRoutes = require('./routes/students');
const createStudentTable = require('./config/dbInit'); // Import the function

const app = express();
app.use(bodyParser.json());

// Initialize Swagger
swaggerDocs(app);

// Student routes
app.use('/students', studentRoutes);

// Run the database initialization function
async function initialize() {
    await createStudentTable(); // Call the function to create the table
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}

initialize(); // Run the initialization function
