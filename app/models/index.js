const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  const sql = `
    SELECT pubs.id, pubs.name, pubs.address, COALESCE(AVG(reviews.rating), 0) AS average_rating
    FROM pubs
    LEFT JOIN reviews ON pubs.id = reviews.pub_id
    GROUP BY pubs.id
    ORDER BY average_rating DESC, pubs.name ASC
    LIMIT 3
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.render("index", {
        user_email: req.session.user_email,
        first_name: req.session.first_name,
        featuredPubs: []
      });
    }

    res.render("index", {
      user_email: req.session.user_email,
      first_name: req.session.first_name,
      featuredPubs: results
    });
  });
});


router.get("/login", (req, res) => {
  res.redirect("/?login=true");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error. Please try again later." 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "No account found with that email." 
      });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (bcryptErr, match) => {
      if (bcryptErr) {
        console.error("Bcrypt error:", bcryptErr);
        return res.status(500).json({ 
          success: false, 
          message: "Error processing login." 
        });
      }

      if (!match) {
        return res.status(401).json({ 
          success: false, 
          message: "Incorrect password. Please try again." 
        });
      }

      req.session.user_id = user.id;
      req.session.user_email = user.email;
      req.session.first_name = user.first_name;

      return res.json({ 
        success: true, 
        redirect: "/" 
      });
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;