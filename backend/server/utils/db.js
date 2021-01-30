const knex = require('knex')({
  client: 'mysql',
  connection: {
    // host: 'us-cdbr-east-03.cleardb.com',
    // user: 'b0fcb0931e803b',
    // password: 'ffaab3f2',
    database: 'mysql://b0fcb0931e803b:ffaab3f2@us-cdbr-east-03.cleardb.com/heroku_7fac5bf006f4d9a?reconnect=true',
  },
  // pool: {
  //   min: 0,
  //   max: 50
  // }
});

module.exports = knex;
