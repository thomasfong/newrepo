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
  router.get("/",utilities.handleErrors(accountController.accountManagement))
   /*****************
    * login process
    * unit 04 stickness activity
    * modified in unit five login process activity
    */
   router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
   )

   /*********************
    * account route
    * check login view.
    ***********************/
   router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))

    // Route to process login
    router.post("/login", utilities.handleErrors(accountController.accountLogin))

   // Route to process logout
   router.get("/logout", utilities.handleErrors(accountController.logoutaccount))

   
/* ************************************
 *  Deliver Account Management View
 *  Unit 5, JWT Authorization activity
 *  ******************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)


/* ****************************************
 *5 /5
 **************************************** */
router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
)

/* ****************************************
 *5 -5
 **************************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkEditData,
  utilities.handleErrors(accountController.processUpdate)
)

/* ****************************************
5-5
 **************************************** */
router.post(
  "/password",
  utilities.checkLogin,
  regValidate.passwordRule(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.processPassword)
)

module.exports= router
