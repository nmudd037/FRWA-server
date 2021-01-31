/* eslint-disable no-unused-vars */
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');
const knex = require('knex');
const { v4: uuidv4 } = require('uuid');

const knexConfig = require('./knexfile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

// Implement CORS
app.use(cors()); //Sets Access-Control-Allow-Origin: *
app.options('*', cors());

app.use(helmet());

//We use Morgan Middleware based on whether we are in development environment or production environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Implementing Rate Limiting - Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //Middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //URL encoded data parser

//Data Sanitization against XSS Attacks
app.use(xss());

//Compression
app.use(compression());

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

//Handling Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json(`Can't find ${req.originalUrl} on this server`);
  next();
});

//4) Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
