const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /users
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    res.render("users", { users: results });
  });
});

// GET /users/:id
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const userQuery = "SELECT * FROM users WHERE id = ?";
  const reviewsQuery = `
    SELECT reviews.*, pubs.name AS pub_name, beers.name AS beer_name
    FROM reviews
    JOIN pubs ON reviews.pub_id = pubs.id
    JOIN beers ON reviews.beer_id = beers.id
    WHERE reviews.user_id = ?
  `;

  db.query(userQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).send("Database error");

    if (userResults.length === 0) {
      return res.status(404).send("User not found");
    }

    db.query(reviewsQuery, [userId], (err, reviewResults) => {
      if (err) return res.status(500).send("Database error");

      res.render("user", {
        user: userResults[0],
        reviews: reviewResults
      });
    });
  });
});

module.exports = router;