/* eslint-disable no-unused-vars */
// const knexx = require('knex')()
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.bigIncrements('id')
    table.string('name')
    table.string('username').unique()
    table.string('email').unique()
    table.string('password')
    table.text('bio')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
}
