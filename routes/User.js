const express = require('express');
const router = express.Router();

// Sample user storage (replace with database later)
let users = [];

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }
  
  // Check if user already exists
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }
  
  // Create new user (in real app, hash password)
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production, hash this!
    role: 'user',
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // In real app, return JWT token here
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) { // In real app, compare hashed password
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // In real app, return JWT token here
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', (req, res) => {
  // In real app, get user from JWT token
  res.json({
    success: true,
    message: 'User profile endpoint - implement with JWT'
  });
});

module.exports = router;