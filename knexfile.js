// Update with your config settings.
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './DB/migrations'
    },
    seeds: {
      directory: './DB/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './DB/migrations'
    }
  }
};
