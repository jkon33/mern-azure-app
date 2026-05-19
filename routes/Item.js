const express = require('express');
const router = express.Router();

// Sample data (replace with your actual database model later)
let items = [
  {
    _id: '1',
    name: 'Sample Item',
    description: 'This is a sample item',
    price: 99.99,
    category: 'other',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// @route   GET /api/items/:id
// @desc    Get single item
// @access  Public
router.get('/:id', (req, res) => {
  const item = items.find(i => i._id === req.params.id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  res.json({
    success: true,
    data: item
  });
});

// @route   POST /api/items
// @desc    Create an item
// @access  Public (change to Private when you add auth)
router.post('/', (req, res) => {
  const { name, description, price, category } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, description, and price'
    });
  }
  
  const newItem = {
    _id: Date.now().toString(),
    name,
    description,
    price,
    category: category || 'other',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  items.push(newItem);
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Public (change to Private when you add auth)
router.delete('/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i._id === req.params.id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  items.splice(itemIndex, 1);
  
  res.json({
    success: true,
    message: 'Item removed successfully'
  });
});

module.exports = router;