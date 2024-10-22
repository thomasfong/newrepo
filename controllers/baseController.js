const utilities = require("../utilities/")
const baseController = {}

/* ***********************
* Buid Home view with MVC
************************** */
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController