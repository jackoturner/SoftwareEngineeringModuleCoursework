const express = require("express");
const router = express.Router();
const db = require("../services/db");

// All pubs
router.get("/", (req, res) => {
  db.query("SELECT * FROM pubs", (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("pubs", { pubs: results });
  });
});

// Single pub with reviews
router.get("/:id", (req, res) => {
  const pubId = req.params.id;

  const pubQuery = "SELECT * FROM pubs WHERE id = ?";
  const reviewsQuery = `
    SELECT reviews.*, users.first_name, users.last_name, beers.name AS beer_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    JOIN beers ON reviews.beer_id = beers.id
    WHERE reviews.pub_id = ?
  `;

  db.query(pubQuery, [pubId], (err, pubResults) => {
    if (err) return res.status(500).send("Database error");

    if (pubResults.length === 0) {
      return res.status(404).send("Pub not found");
    }

    db.query(reviewsQuery, [pubId], (err, reviewResults) => {
      if (err) return res.status(500).send("Database error");

      res.render("pub", {
        pub: pubResults[0],
        reviews: reviewResults
      });
    });
  });
});

module.exports = router;