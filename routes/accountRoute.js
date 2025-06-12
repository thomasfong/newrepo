const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation')
const { verifyAuth, checkLogin } = require('../utilities/authMiddleware');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post("/register",
  regValidate.validate.registationRules(),  
  regValidate.validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
);

router.get("/", 
  verifyAuth, 
  utilities.handleErrors(accountController.buildManagement)
);

router.get("/", 
  verifyAuth, 
  utilities.handleErrors(accountController.accountManagement)
);

// Prevent logged-in users from accessing login/register
router.get("/login", 
  checkLogin,
  utilities.handleErrors(accountController.buildLogin)
);

router.get("/logout",
  verifyAuth,
  utilities.handleErrors(accountController.accountLogout)
);

router.get("/register", 
  checkLogin,
  utilities.handleErrors(accountController.buildRegister)
);



module.exports = router