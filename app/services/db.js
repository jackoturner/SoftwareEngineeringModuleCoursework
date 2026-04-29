require("dotenv").config();

const mysql = require("mysql2");

const host =
  process.env.DB_HOST ||
  process.env.DB_CONTAINER ||
  process.env.MYSQL_HOST ||
  "127.0.0.1";

const port =
  process.env.DB_PORT ||
  process.env.MYSQL_PORT ||
  3306;

const user =
  process.env.DB_USER ||
  process.env.MYSQL_USER ||
  "root";

const password =
  process.env.DB_PASSWORD ||
  process.env.MYSQL_PASSWORD ||
  "password";

const database =
  process.env.DB_NAME ||
  process.env.MYSQL_DATABASE ||
  "tapthat-db";

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
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