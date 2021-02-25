const express = require('express');
//const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');

const users = require('./routes/users');
const auth = require('./routes/auth');
const images = require('./routes/images');

const app = express();

// Implement CORS
app.use(cors()); //Sets Access-Control-Allow-Origin: *
app.options('*', cors());

app.use(helmet());

//We use Morgan Middleware based on whether we are in development environment or production environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Implementing Rate Limiting - Limit requests from same IP
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

//const db = knex(knexConfig[process.env.NODE_ENV]);

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

// Define routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/images', images);

//Handling Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json(`Can't find ${req.originalUrl} on this server`);
  next();
});

module.exports = app;
