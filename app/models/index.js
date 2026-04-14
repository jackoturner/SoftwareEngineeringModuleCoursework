const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }

  res.render("index", {
    user_email: req.session.user_email
  });
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

    bcrypt.compare(password, user.password_hash, (bcryptErr, match) => {
      if (bcryptErr) {
        console.error("Bcrypt error:", bcryptErr);
        return res.status(500).send("Server error");
      }

      if (!match) {
        return res.status(401).send("Incorrect password");
      }

      req.session.user_id = user.id;
      req.session.user_email = user.email;

      return res.redirect("/");
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;