require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));



// Home route
app.get('/', (req, res) => {
  // res.status(200).json({
  //   success: true,
  //   message: 'Welcome to E-commerce API',
  //   documentation: '/api-docs',
  //   status: 'Server is running'
  // });
  res.send("First App")
});

// // Test route
// app.get('/home', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Home route is working!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Handle 404 routes
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});