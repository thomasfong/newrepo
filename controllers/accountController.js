const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      account_email: req.body.account_email || '',
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: '',
      account_lastname: '',
      account_email: '',
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Check if email already exists
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      req.flash("error", "Email already exists. Please log in or use a different email.");
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Register account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "success",
        `Congratulations, ${account_firstname}! You're now registered. Please log in.`
      );
      return res.redirect("/account/login");
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Sorry, there was an error processing your registration.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav: await utilities.getNav(),
      errors: null,
      ...req.body
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      
      // Create JWT token
      const accessToken = jwt.sign(
        { 
          account_id: accountData.account_id,
          account_email: accountData.account_email,
          account_type: accountData.account_type 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
      );
      
      // Set secure cookie
      res.cookie("jwt", accessToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });
      
      req.flash("success", `Welcome back, ${accountData.account_firstname}!`);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: null,
      account_email: req.body.account_email || ''
    });
  }
}

/* ****************************************
*  Account Management View
* *************************************** */
async function accountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.user.account_id);
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Logout
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie('jwt');
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin,
  accountManagement,
  accountLogout
};