const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "us-cdbr-east-03.cleardb.com",
    user: "bc9fe46ab978c4",
    password: "dff18b2c",
    database: "heroku_b9918a35cae33c8",
    port: 3306,
  },
  pool: {
    min: 0,
    max: 50,
  },
});

module.exports = knex;
