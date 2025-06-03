/*
Account route
Deliver a login view
*/
// need resources
const express =require("express")
const router =new express.Router()
const accountController =require("../controllers/accountController")
const utilities =require("../utilities")
const regValidate = require('../utilities/account-validation')



/******************************************
 * Deliver login view
 * unit 4 deliver login view activity
 * 
 ***************************************/
router.get("/login",utilities.handleErrors(accountController.buildLogin))

/********************
 * Deliver registration view
 * unit 4 Deliver registration view activity
 * 
 */
router.get("/register",utilities.handleErrors(accountController.buildRegister))

/***********************************
 * process registration
 * unit 4 process registration Activity
 */
// router.post("/register", utilities.handleErrors(accountController.registerAccount))


// changes
// console.log(regValidate); // Debug: Log the regValidate object
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Process the login data
  // router.post(
  //   "/login",
  //   regValidate.loginRules(),
  //   regValidate.checkLoginData,
  //   utilities.handleErrors(accountController.loginAccount)
  // )

//  router.post(
// )
// router.get(
    
// )
// Process the login attempt
// router.post(
//   "/login",
//   (req, res) => {
//     res.status(200).send('login process')
//   }
// )
 

module.exports= router
