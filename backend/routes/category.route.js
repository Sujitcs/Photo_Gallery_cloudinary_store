const categorymodel = require('../models/Category.model');
const express = require('express');
const categoryrouter = express.Router();
const auth = require('../middlewares/authMiddleware');
require('dotenv').config();
//const connectDB = require('./middlewares/db');
// Add Category
categoryrouter.post('/add',auth,async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categorymodel.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get All Categories
categoryrouter.get('/list', async (req, res) => {
  try {
    const categories = await categorymodel.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Category
categoryrouter.delete('/delete/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categorymodel.findByIdAndDelete(id);

    if (category) {
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Edit Category
categoryrouter.put('/edit/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; 

  try {
    // Find the category by ID and update its name
    const updatedCategory = await categorymodel.findByIdAndUpdate(
      id,                         // ID of the category to update
      { name },                   // Update the name field
      { new: true }               // Return the updated document
    );

    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = categoryrouter;
console.log('category router is ready');
