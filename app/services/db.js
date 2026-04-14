require("dotenv").config();

const mysql = require("mysql2");

const host =
  process.env.DB_HOST ||
  process.env.DB_CONTAINER ||
  process.env.MYSQL_HOST;
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || process.env.MYSQL_USER;
const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
const database = process.env.DB_NAME || process.env.MYSQL_DATABASE;

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
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
