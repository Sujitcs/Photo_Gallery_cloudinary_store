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
    folder: 'photogallery', // Folder name in Cloudinary where images will be stored
    format: async (req, file) => {
      const allowedFormats = ['jpeg', 'png', 'jpg'];
      const fileFormat = file.mimetype.split('/')[1];
      return allowedFormats.includes(fileFormat) ? fileFormat : 'jpeg'; // Default to 'jpeg'
    },
    public_id: (req, file) => file.originalname.split('.')[0], // Name to save in Cloudinary
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
  },
});
// Add Multiple Images
imagerouter.post('/addimage', auth, upload.array('images', 10), async (req, res) => {
  const { name, category } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    // Array to hold all new image documents to be created
    const newImages = [];

    // Iterate through each uploaded file
    for (const file of req.files) {
      // Use the Cloudinary URL and public_id from each file
      const image = file.path; // URL of the uploaded image in Cloudinary
      const public_id = file.filename; // Cloudinary public_id for later deletion

      // Create a new image document and push it to the newImages array
      const newImage = {
        name,
        category,
        image,
        public_id,
      };
      newImages.push(newImage);
    }
    // Save all new images to the database at once
    const savedImages = await imagemodel.insertMany(newImages);

    res.status(201).json(savedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Add Image
// imagerouter.post('/addimage', auth, upload.single('image'), async (req, res) => {
//   const { name, category } = req.body;

//   try {
//     // Use the Cloudinary URL and public_id from req.file
//     const image = req.file.path; // URL of the uploaded image in Cloudinary
//     const public_id = req.file.filename; // Cloudinary public_id for later deletion

//     const newImage = await imagemodel.create({ name, category, image, public_id });

//     res.status(201).json(newImage);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// Edit Image
// Edit Image
imagerouter.put('/editimage/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const image = req.file ? req.file.path : null;
  const public_id = req.file ? req.file.filename : null;

  try {
    const existingImage = await imagemodel.findById(id);

    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Prepare the updated data
    const updatedImageData = { name, category };

    if (image) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(existingImage.public_id);
      updatedImageData.image = image;
      updatedImageData.public_id = public_id;
    }

    // Update the image data in MongoDB
    const updatedImage = await imagemodel.findByIdAndUpdate(id, updatedImageData, { new: true });

    res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
  } catch (error) {
    console.error('Failed to update image:', error);
    res.status(500).json({ message: 'Failed to update image', error: error.message });
  }
});


// Get all images
imagerouter.get('/getimage', async (req, res) => {
  try {
    const images = await imagemodel.find({});
    console.log('Fetched images:', images); // Log the images
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get images by category
imagerouter.get('/getimage/:category', async (req, res) => {
  const category = req.params.category;
  try {
    const images = await imagemodel.find({ category });
    res.json(images); // Ensure this returns the correct URLs
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Image from Cloudinary and database
imagerouter.delete('/deleteimage/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the image document first
    const image = await imagemodel.findByIdAndDelete(id);

    if (image) {
      // Extract public_id for the image to delete from Cloudinary
      const publicId = image.public_id;

      // Remove the file from Cloudinary
      cloudinary.uploader.destroy(publicId, (err, result) => {
        if (err) {
          console.error('Error deleting image from Cloudinary:', err);
          return res.status(500).json({ message: 'Image removed from database but failed to delete file from Cloudinary' });
        }
        console.log('Image deleted from Cloudinary:', result);
        res.json({ message: 'Image removed' });
      });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = imagerouter;
console.log('Image router is ready');
