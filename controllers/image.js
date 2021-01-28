/* eslint-disable no-unused-vars */
const Clarifai = require('clarifai');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.staus(400).json('Unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      //console.log(entries);
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json('Unable to get Entries'));
};

module.exports = {
  handleImage,
  handleApiCall
};
