const express = require("express");
const path = require("path");
const db = require("./services/db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use("/static", express.static(path.join(__dirname, "..", "static")));

// Routes
const usersRoutes = require("./models/users");
const pubsRoutes = require("./models/pubs");
const indexRouter = require("./models/index");
const pourscoreRoutes = require("./models/pourscore");
const mapRoutes = require("./models/map");
const apiRoutes = require("./models/api");

// Order matters
app.use("/users", usersRoutes);
app.use("/pubs", pubsRoutes);
app.use("/", indexRouter);
app.use("/pourscore", pourscoreRoutes);
app.use("/map", mapRoutes);
app.use("/api", apiRoutes);

// Database readiness check
function testDBConnection(retries = 5) {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.log("Waiting for DB...");
      if (retries > 0) {
        setTimeout(() => testDBConnection(retries - 1), 2000);
      } else {
        console.error("DB connection failed");
      }
    } else {
      console.log("DB ready");
    }
  });
}

app.get("/api/pubs/:id/beers", (req, res) => {
  const pubId = req.params.id;

  const sql = `
    SELECT beers.id, beers.name
    FROM pub_beers
    JOIN beers ON pub_beers.beer_id = beers.id
    WHERE pub_beers.pub_id = ? AND pub_beers.is_available = 1
  `;

  db.query(sql, [pubId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Handle review submission
app.post("/api/reviews", (req, res) => {
  const { pub_id, beer_id, rating, comment } = req.body;
  const user_id = 1; // NEED TO CHANGE WITH LOGIN PAGE

  if (!pub_id || !beer_id || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const ai_pour_score = (Math.random() * 1.5 + 3.5).toFixed(2);

  const sql = `
    INSERT INTO reviews (user_id, pub_id, beer_id, rating, ai_pour_score, comment)
    VALUES (?, ?, ?, ?, NULL, ?)
  `;

  db.query(sql, [user_id, pub_id, beer_id, rating, comment], (err, result) => {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({ error: "Failed to save review" });
    }

    res.json({ 
      success: true, 
      message: "Review submitted successfully!",
      review_id: result.insertId 
    });
  });
});

testDBConnection();

// Server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
