exports.up = function (knex) {
  return knex.schema.createTable('login', (table) => {
    table.uuid('id').primary();
    table.string('hash').notNullable();
    table.text('email').unique().notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('login');
};
