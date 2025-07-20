require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const projectLoginRoutes = require('./src/routes/ProjectLogin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with proper error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Check if already connected to avoid multiple connections
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

// Initialize MongoDB connection
connectDB();

// Routes
app.use('/api', projectLoginRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// For Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}