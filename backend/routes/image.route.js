const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const imagerouter = express.Router();
const auth = require('../middlewares/authMiddleware');
const imagemodel = require('../models/Image.model');
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'photogallery',
    format: async (req, file) => {
      const allowedFormats = ['jpeg', 'png', 'jpg'];
      const fileFormat = file.mimetype.split('/')[1];
      return allowedFormats.includes(fileFormat) ? fileFormat : 'jpeg';
    },
    public_id: (req, file) => `${file.originalname.split('.')[0]}_${Date.now()}`,
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file), false);
    }
  },
});

// Add Multiple Images
imagerouter.post('/addimage', auth, upload.array('image', 10), async (req, res) => {
  const { name, category } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    const newImages = req.files.map(file => ({
      name,
      category,
      image: file.path,
      public_id: file.filename,
    }));

    const savedImages = await imagemodel.insertMany(newImages);
    res.status(201).json(savedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Edit Multiple Images
imagerouter.put('/editimage/:id', auth, upload.array('image', 10), async (req, res) => {
  const { imageIds, name, category } = req.body;

  if (!imageIds || !Array.isArray(imageIds)) {
    return res.status(400).json({ message: 'No image IDs provided' });
  }

  try {
    const updatedImages = [];

    for (let i = 0; i < imageIds.length; i++) {
      const id = imageIds[i];
      const existingImage = await imagemodel.findById(id);

      if (!existingImage) {
        return res.status(404).json({ message: `Image with ID ${id} not found` });
      }

      // Prepare the updated data
      const updatedImageData = { name, category };

      // Check if a new file was uploaded for this image
      if (req.files && req.files[i]) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(existingImage.public_id);
        updatedImageData.image = req.files[i].path; // New image URL
        updatedImageData.public_id = req.files[i].filename; // New public_id
      }

      // Update the image in the database
      const updatedImage = await imagemodel.findByIdAndUpdate(id, updatedImageData, { new: true });
      updatedImages.push(updatedImage);
    }

    res.status(200).json({ message: 'Images updated successfully', images: updatedImages });
  } catch (error) {
    console.error('Failed to update images:', error);
    res.status(500).json({ message: 'Failed to update images', error: error.message });
  }
});

// Get all images
imagerouter.get('/getimage', async (req, res) => {
  try {
    const images = await imagemodel.find({});
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get images by category
imagerouter.get('/getimage/:category', async (req, res) => {
  const category = req.params.category;
  try {
    const images = await imagemodel.find({ category });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images by category:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete Image from Cloudinary and database
imagerouter.delete('/deleteimage/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const image = await imagemodel.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await cloudinary.uploader.destroy(image.public_id);
    await imagemodel.findByIdAndDelete(id);

    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = imagerouter;
console.log('Image router is ready');
