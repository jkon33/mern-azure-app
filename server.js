const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// UPDATE THIS WITH YOUR VERCEL URL
const allowedOrigins = [
  'http://localhost:3000',                    // Local development
  'https://mern-azure-app.vercel.app'         // Your Vercel frontend
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('CORS policy does not allow access from this origin'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route (BEFORE database connection)
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors_enabled: true
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in environment variables');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit the process, just log the error
  }
};

// Connect to MongoDB (don't await here - let it run in background)
connectDB();

// Import routes (with error handling)
let itemRoutes, userRoutes;

try {
  itemRoutes = require('./routes/items');
  userRoutes = require('./routes/users');
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  
  // Fallback routes if files don't exist
  itemRoutes = express.Router();
  itemRoutes.get('/', (req, res) => {
    res.json({ message: 'Items endpoint - implement your routes file' });
  });
  
  userRoutes = express.Router();
  userRoutes.get('/', (req, res) => {
    res.json({ message: 'Users endpoint - implement your routes file' });
  });
}

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MERN API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      test: '/api/test',
      items: '/api/items',
      users: '/api/users',
      health: '/health'
    },
    frontend_url: 'https://mern-azure-app.vercel.app'
  });
});

// Serve static files if client/build exists (for Render)
const clientBuildPath = path.join(__dirname, 'client', 'build');
const fs = require('fs');

if (fs.existsSync(clientBuildPath)) {
  console.log('✅ Serving static files from client/build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.log('⚠️ client/build not found - API only mode');
}

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: ['/api/test', '/api/items', '/api/users', '/health', '/']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({ 
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    path: req.path
  });
});

// Start server
const PORT = process.env.PORT || 10000; // Render uses 10000 by default

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Don't exit the process, just log
});