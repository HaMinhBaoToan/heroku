const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b0fcb0931e803b',
    password: 'ffaab3f2',
    database: 'heroku_7fac5bf006f4d9a',
  },
  pool: {
    min: 0,
    max: 50
  }
});

module.exports = knex;
