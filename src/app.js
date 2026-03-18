const express = require("express");
const path = require("path");
const db = require("./config/db");

const app = express();

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
const usersRoutes = require("./routes/users");
const pubsRoutes = require("./routes/pubs");
const indexRouter = require("./routes/index");

// Order matters
app.use("/users", usersRoutes);
app.use("/pubs", pubsRoutes);
app.use("/", indexRouter);

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