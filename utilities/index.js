const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildSingleVehicleDisplay = async (vehicle) => {
  // Format price as USD with commas and currency symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format mileage with commas
  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  // Use fallback image if inv_image is missing or empty
  const imageSrc = vehicle.inv_image && vehicle.inv_image !== ''
    ? vehicle.inv_image
    : '/images/vehicle-placeholder.jpg';

  // Build HTML structure
  let svd = '<section id="vehicle-display" role="region" aria-label="Vehicle Details">';
  svd += '<div class="vehicle-detail-container">';
  svd += '<div class="vehicle-image">';
  svd += `<img src="${imageSrc}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />`;
  svd += '</div>';
  svd += '<div class="vehicle-info">';
  svd += `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  svd += '<div class="vehicle-specs">';
  svd += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  svd += `<p><strong>Price:</strong> ${formatCurrency(vehicle.inv_price)}</p>`;
  svd += `<p><strong>Mileage:</strong> ${formatNumber(vehicle.inv_miles)} miles</p>`;
  svd += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  svd += `<p><strong>Class:</strong> ${vehicle.classification_name}</p>`;
  svd += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  svd += '</div>';
  svd += '<a href="/contact" class="cta-button" role="button" tabindex="0">Contact Dealer</a>';
  svd += '</div>';
  svd += '</div>';
  svd += '</section>';
  return svd;
}
// new changes added 03.06.2025.
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
// Util.checkJWTToken = (req, res, next) => {
//   if (req.cookies.jwt) {
//    jwt.verify(
//     req.cookies.jwt,
//     process.env.ACCESS_TOKEN_SECRET,
//     function (err, accountData) {
//      if (err) {
//       req.flash("Please log in")
//       res.clearCookie("jwt")
//       return res.redirect("/account/login")
//      }
//      res.locals.accountData = accountData
//      res.locals.loggedin = 1
//      next()
//     })
//   } else {
//    next()
//   }
//  }


Util.checkJWTToken = (req, res, next) => {
  try {
    console.log("Checking JWT cookie")
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("ACCESS_TOKEN_SECRET is not defined in .env")
      res.locals.loggedin = 0
      res.locals.accountData = null
      return next()
    }
    if (req.cookies.jwt) {
      console.log("JWT cookie found:", req.cookies.jwt)
      jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
        if (err) {
          console.log("JWT verification error:", err.message)
          res.clearCookie("jwt", { httpOnly: true })
          res.locals.loggedin = 0
          res.locals.accountData = null
        } else {
          console.log("Setting res.locals.accountData:", accountData)
          res.locals.loggedin = 1
          res.locals.accountData = accountData
        }
        next()
      })
    } else {
      console.log("No JWT cookie found")
      res.locals.loggedin = 0
      res.locals.accountData = null
      next()
    }
  } catch (error) {
    console.error("Error in checkJWTToken:", error.message, error.stack)
    next(error)
  }
}
 /**************************
  * used to check if is admin or employee
  */
 Util.restrictToEmployeeOrAdmin = (req, res, next) => {
  try {
    console.log("Restricting access - loggedin:", res.locals.loggedin, "account_type:", res.locals.accountData?.account_type)
    if (res.locals.loggedin && ['Employee', 'Admin'].includes(res.locals.accountData?.account_type)) {
      console.log("Access granted for user:", res.locals.accountData?.account_email)
      next()
    } else {
      console.log("Access denied - redirecting to login")
      req.flash("notice", "Please log in as an Employee or Admin to access this page.")
      return res.redirect("account/login")
    }
  } catch (error) {
    console.error("Error in restrictToEmployeeOrAdmin:", error.message, error.stack)
    next(error)
  }
}

Util.handleErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error("Error in route:", err.message, err.stack)
    res.status(500).render("error", {
      title: "Server Error",
      nav: '<ul><li><a href="/">Home</a></li></ul>',
      message: "Oh no! There was a crash. Maybe try a different route?"
    })
  })
}

  /****************************************
 *  Check Login
 * ************************************ */
//  Util.checkLogin = (req, res, next) => {
//   console.log("Checking loggedin status:", res.locals.loggedin, "account_type:", res.locals.accountData?.account_type)
//   if (res.locals.loggedin && ['Employee', 'Admin'].includes(res.locals.accountData?.account_type)) {
//     next()
//   } else {
//     req.flash("notice", "Please log in as an Employee or Admin.")
//     return res.redirect("account/login")
//   }
// }
/* ****************************************
 *  Check Login
 *  Unit 5, jwt authorize activity
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports =Util