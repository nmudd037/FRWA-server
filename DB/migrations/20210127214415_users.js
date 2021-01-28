exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('name');
    table.text('email').unique().notNullable();
    table.bigInteger('entries').defaultTo(0);
    table.timestamp('joined').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
