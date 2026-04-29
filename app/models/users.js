const express = require("express");
const router = express.Router();
const db = require("../services/db");

// users.js – updated GET / route
router.get("/", (req, res) => {
  const search = req.query.search || "";
  let sql = `
    SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, 
      COALESCE(AVG(r.rating), 0) AS average_rating
    FROM users u
    LEFT JOIN reviews r ON u.id = r.user_id
  `;
  const params = [];

  if (search.trim() !== "") {
    sql += ` WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  sql += ` GROUP BY u.id ORDER BY u.id`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.render("users", { users: results, search: search });
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
    ORDER BY reviews.created_at DESC
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