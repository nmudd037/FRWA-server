const dotenv = require('dotenv');
const knex = require('knex');

const knexConfig = require('./knexfile');

dotenv.config({ path: './config.env' });

exports.db = knex(knexConfig[process.env.NODE_ENV]);
