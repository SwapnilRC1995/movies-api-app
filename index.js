const express = require('express');
require('dotenv').config();
const routes = require('./route')

// Initialize express app
const app = express();

// Attach routes to app
app.use('/', routes)

// Set constant for port
const PORT = process.env.PORT || 8000

// Listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));