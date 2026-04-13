const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to render map page
router.get("/", (req, res) => {
  res.render("map");
});

// Model function to get all pubs from database
const getAllPubs = (callback) => {
  const sql = "SELECT id, name, address, latitude, longitude FROM pubs";
  db.query(sql, callback);
};

// API endpoint to return pubs as JSON
router.get("/api/pubs", (req, res) => {
  getAllPubs((err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;