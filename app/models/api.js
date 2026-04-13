const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/pubs", (req, res) => {
  const sql = "SELECT id, name, address, latitude, longitude FROM pubs";
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;