require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_CONTAINER,
  port: process.env.DB_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
});

function query(sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }

  return pool.query(sql, params, callback);
}

module.exports = {
  query,
};
