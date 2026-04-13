const express = require("express");
const path = require("path");
const db = require("./services/db");

const app = express();

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

testDBConnection();

// Server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
