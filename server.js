/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorHandler = require('./utilities/errorHandler');
const session = require("express-session")
const pool = require('./database/')
const utilities = require('./utilities/')
const accountRoute = require('./routes/accountRoute') 


// Inventory routes
app.use("/account", accountRoute )
app.use("/inv", inventoryRoute)
app.use(errorHandler.notFound);
app.use(errorHandler.handleErrors);

// error route
app.get('/trigger-error', (req, res, next) => {
  try {
    // Intentionally cause an error
    throw new Error('This is a test 500 error');
  } catch (err) {
    next(err);
  }
});

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
//Index route - Unit 3, activity
app.use("/", utilities.handleErrors(baseController.buildHome))
//Inventory routes -Unit 3, activity
app.use("/inv", require("./routes/inventoryRoute"))
//Account routes -Unit 4, activity
app.use('/account', accountRoute);

// Index route
app.get("/", baseController.buildHome)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
