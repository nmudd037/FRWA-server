const fs = require('fs');

exports.seed = function (knex) {
  //Import Users
  const login = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/login.json`, 'utf-8')
  );
  return (
    knex('login')
      // Deletes ALL existing entries
      .del()
      // Inserts seed entries
      .then(() => knex.batchInsert('login', login))
  );
};
