const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/pubs", (req, res) => {
  const search = req.query.search;
  let sql = `
    SELECT 
      pubs.id,
      pubs.name,
      pubs.address,
      pubs.postcode,
      pubs.latitude,
      pubs.longitude,
      reviews.comment,
      reviews.rating,
      reviews.ai_pour_score
    FROM pubs
    LEFT JOIN reviews 
      ON reviews.id = (
        SELECT r.id 
        FROM reviews r 
        WHERE r.pub_id = pubs.id 
        ORDER BY r.created_at DESC 
        LIMIT 1
      )
  `;
  
  const params = [];
  if (search) {
    sql += ` WHERE pubs.name LIKE ? OR pubs.address LIKE ?`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;