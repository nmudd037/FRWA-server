const fs = require('fs');

exports.seed = function (knex) {
  //Import Users
  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/users.json`, 'utf-8')
  );
  return (
    knex('users')
      // Deletes ALL existing entries
      .del()
      // Inserts seed entries
      .then(() => knex.batchInsert('users', users))
  );
};
