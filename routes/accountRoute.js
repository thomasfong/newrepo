const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation');
const { verifyAuth, checkLogin } = require('../utilities/authMiddleware');
const { 
  registrationRules, 
  checkRegData,
  updateRules,
  checkUpdateData,
  passwordRules,
  checkPasswordData 
} = require('../utilities/account-validation');

// Route to build login view
router.get("/login", 
  checkLogin,
  utilities.handleErrors(accountController.buildLogin)
);

// Route to build registration view
router.get("/register", 
  checkLogin,
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post("/register",
  registrationRules(),  
  checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post("/login",
  utilities.handleErrors(accountController.accountLogin)
);

// Account management routes
router.get("/", 
  verifyAuth, 
  utilities.handleErrors(accountController.buildManagement)
);

router.get("/management", 
  verifyAuth, 
  utilities.handleErrors(accountController.accountManagement)
);

// Logout route
router.get("/logout",
  verifyAuth,
  utilities.handleErrors(accountController.accountLogout)
);

// Account update routes
router.get('/update/:id', 
  verifyAuth,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post('/update-info',
  verifyAuth,
  updateRules(),
  checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

router.post('/update-password',
  verifyAuth,
  passwordRules(),
  checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);



module.exports = router;