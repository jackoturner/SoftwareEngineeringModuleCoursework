require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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