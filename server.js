/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const errorController = require("./controllers/errorController");

/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

app.use(express.static('public'));
app.use(static);

// Inventory routes
app.use("/inv", inventoryRoute);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Error Trigger route (Footer-based error)
app.get("/error-test", errorController.triggerError);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

// Express Error Handler (Unified)
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { errorMessage: err.message });
});

const path = require("path");
app.set("views", path.join(__dirname, "views"));

// Middleware for Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { errorMessage: err.message });
});
