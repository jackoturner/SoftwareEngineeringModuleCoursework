const express = require("express");
const path = require("path");
const db = require("./services/db");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id;
  res.locals.first_name = req.session.first_name;
  next();
});

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

// Middleware to require login
function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    return res.redirect(`/?login=true&continue=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
}

// Order matters
app.use("/", indexRouter);
app.use("/users", requireLogin, usersRoutes);
app.use("/pubs", requireLogin, pubsRoutes);
app.use("/pourscore", requireLogin, pourscoreRoutes);
app.use("/map", requireLogin, mapRoutes);
app.use("/api", requireLogin, apiRoutes);

// Database readiness check
function testDBConnection(retries = 30) {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.log("Waiting for DB...");
      if (retries > 0) {
        setTimeout(() => testDBConnection(retries - 1), 2000);
      } else {
        console.error(" ❌ DB connection failed");
        process.exit(1);
      }
    } else {
      console.log(" ✅ DB is ready");
      console.log(" 🍺 TapThat is running!");
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

// Review submission
app.post("/api/reviews", (req, res) => {
  const { pub_id, beer_id, rating, comment } = req.body;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).json({ error: "You must be logged in" });
  }

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