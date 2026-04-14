const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(401).send("User not found");
    }

    const user = results[0];

    if (password !== user.password_hash) {
      return res.status(401).send("Incorrect password");
    }

    return res.redirect("/");
  });
});

module.exports = router;