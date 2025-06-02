const express = require('express');
const connectDB = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (body parser, etc.)
app.use(express.json());

connectDB();

// Connect to DB and start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
