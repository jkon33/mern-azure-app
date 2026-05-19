const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes (make sure these files exist!)
try {
  const itemRoutes = require('./routes/items');
  const userRoutes = require('./routes/users');
  
  app.use('/api/items', itemRoutes);
  app.use('/api/users', userRoutes);
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  // Fallback route if files don't exist
  app.get('/api/items', (req, res) => {
    res.json({ message: 'Items endpoint - routes file not found' });
  });
  app.get('/api/users', (req, res) => {
    res.json({ message: 'Users endpoint - routes file not found' });
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MERN API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      items: '/api/items',
      users: '/api/users',
      health: '/health'
    }
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal error' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/api/test`);
});