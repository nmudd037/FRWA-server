const Clarifai = require('clarifai');
const dotenv = require('dotenv');
const express = require('express');
const authO = require('../middleware/authO');
const { db } = require('../dbConnect');
const { verifyImageUrl } = require('../utils');

const router = express.Router();

dotenv.config({ path: './config.env' });

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

// @route   POST  api/images
// @desc    Submit an image for Clarifai API
// @access  Private
router.post('/', authO, async (req, res) => {
  const { imageUrl } = req.body;
  const validUrl = await verifyImageUrl(imageUrl);

  if (!validUrl) {
    return res.status(400).json({ msg: 'Please provide a valid image url' });
  }

  try {
    const data = await app.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl);

    res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Unable to work with Clarifai API');
  }
});

// @route   PATCH  api/images
// @desc    Update image entries for user
// @access  Private
router.patch('/:id', authO, async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  const validUrl = await verifyImageUrl(imageUrl);
  if (!validUrl) {
    return res.status(400).json({ msg: 'Please provide a valid image url' });
  }

  try {
    const entries = await db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries');

    res.status(200).json({ entries: entries[0] });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
