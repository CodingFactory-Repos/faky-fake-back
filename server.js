const express = require('express');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
dotenv.config();

const app = express();

app.use(helmet());

// CORS setup (allows requests from your frontend URL)
const allowedOrigins = [process.env.FRONT_URL];
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limiter à 20 Mo
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// Route for handling image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log("Image received");

  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const imageBuffer = req.file.buffer;

  try {
    const response = await axios.post(process.env.API_URL, imageBuffer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the result from the API
    res.json(response.data);
  } catch (error) {
    console.error('Error processing the image:', error.message);
    res.status(500).json({ message: 'An error occurred while processing the image.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
