const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
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
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

// @route   POST /api/items
// @desc    Create an item
// @access  Private
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    try {
      const newItem = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category || 'other'
      });

      const item = await newItem.save();
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ 
        success: false, 
        message: 'Server Error' 
      });
    }
  }
);

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    const { name, description, price, category } = req.body;
    
    // Update fields
    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    
    await item.save();
    
    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    
    await item.deleteOne();
    
    res.json({
      success: true,
      message: 'Item removed successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

module.exports = router;