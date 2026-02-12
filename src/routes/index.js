// Defines URL routes and request handling logic
const express = require("express");
const router = express.Router();

// Renders views and sends responses to the client
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

module.exports = router;