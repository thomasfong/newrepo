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

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

// Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.render("errors/error", {
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


// /* ***********************
//  * Require Statements
//  *************************/
// const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
// const env = require("dotenv").config();
// const session = require("express-session");
// const pool = require('./database/');
// const utilities = require('./utilities/');
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const flash = require('connect-flash');
// const app = express();

// // Route imports
// const static = require("./routes/static");
// const baseController = require("./controllers/baseController");
// const inventoryRoute = require('./routes/inventoryRoute');
// const accountRoute = require('./routes/accountRoute');
// const errorRoute = require('./routes/errorRoute');

// /* ***********************
//  * Middleware
//  * ************************/
// app.use(express.static("public"));
// app.use(cookieParser());
//  app.use(session({
//   store: new (require('connect-pg-simple')(session))({
//     createTableIfMissing: true,
//     pool,
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   name: 'sessionId',
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'strict'
//   }
// }))

// app.use(flash());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // JWT Authentication Middleware
// app.use(utilities.checkJWTToken);

// // Express Messages Middleware
// app.use(require('connect-flash')())
// app.use(function(req, res, next){
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

// // Process Registration Activity
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// app.use(cookieParser())

// // JWT Authentication Middleware
// app.use(utilities.checkJWTToken);

// /* ***********************
//  * View Engine and Templates
//  *************************/
// app.set("view engine", "ejs")
// app.use(expressLayouts)
// app.set("layout", "./layouts/layout")

// /* ***********************
//  * Routes
//  *************************/
// app.use(require("./routes/static"))

// // Index route
// // app.get("/", baseController.buildHome)
// //Index route - Unit 3, activity
// app.use("/", utilities.handleErrors(baseController.buildHome))

// // Inventory routes
// app.use("/inv", require("./routes/inventoryRoute"))
// app.use('/account', require("./routes/accountRoute"))

// // error route
// app.use("/trigger-error", errorRoute)
// // File Not Found Route - must be last route in list
// app.use(async (req, res, next) => {
//   next({status: 404, message: 'Sorry, we appear to have lost that page.'})
// })

// /* ***********************
// * Express Error Handler
// * Place after all other middleware
// *************************/
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message,
//     nav
//   })
// })

// /* ***********************
//  * Local Server Information
//  * Values from .env (environment) file
//  *************************/
// const port = process.env.PORT
// const host = process.env.HOST

// /* ***********************
//  * Log statement to confirm server operation
//  *************************/
// app.listen(port, () => {
//   console.log(`app listening on ${host}:${port}`)
// })
