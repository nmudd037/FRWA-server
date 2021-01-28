/* eslint-disable no-unused-vars */
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const { v4: uuidv4 } = require('uuid');

const knexConfig = require('./knexfile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

const db = knex(knexConfig[process.env.NODE_ENV]);

// connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   }

app.get('/', (req, res) => {
  res.send('Welcome to the FRWA API :)');
  //res.send(database.users);
});

app.post('/signin', signin.handleSignin(db, bcrypt));
//app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', register.handleRegister(db, bcrypt, uuidv4));

app.get('/profile', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

//4) Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
