const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        // Check if email already exists in database
        const emailExists = await utilities.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email already exists. Please log in or use different email")
        }
      }),

      // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ***************************
 * Classification Validation Rules
 * ************************** */
const classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a classification name')
            .isAlpha()
            .withMessage('Classification name must contain only letters')
            .isLength({ min: 3 })
            .withMessage('Classification name must be at least 3 characters')
    ]
}

/* ***************************
 * Check classification data and return errors or continue
 * ************************** */
const checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render('inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: errors.array(),
            classification_name: req.body.classification_name
        })
    }
    next()
}

/* ***************************
 * Inventory Validation Rules
 * ************************** */
const inventoryRules = () => {
    return [
        body('classification_id')
            .notEmpty()
            .withMessage('Please select a classification'),
        body('inv_make')
            .trim()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage('Please provide a valid make (min 3 characters)'),
        body('inv_model')
            .trim()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage('Please provide a valid model (min 3 characters)'),
        body('inv_year')
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage('Please provide a valid year'),
        body('inv_description')
            .trim()
            .notEmpty()
            .withMessage('Please provide a description'),
        body('inv_price')
            .isFloat({ min: 0 })
            .withMessage('Please provide a valid price'),
        body('inv_miles')
            .isInt({ min: 0 })
            .withMessage('Please provide valid mileage'),
        body('inv_color')
            .trim()
            .notEmpty()
            .withMessage('Please provide a color')
    ]
}

/* ***************************
 * Check inventory data and return errors or continue
 * ************************** */
const checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        return res.render('inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            classificationList,
            errors: errors.array(),
            ...req.body
        })
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("A valid password is required.")
  ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

const checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        return res.render('inventory/edit-inventory', {
            title: 'Edit Vehicle',
            nav,
            classificationList,
            errors: errors.array(),
            inv_id: req.body.inv_id, // Added inv_id for edit view
            ...req.body
        })
    }
    next()
}

/*  **********************************
 *  Update Account Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
  ]
}

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
  }
  next()
}

/*  **********************************
 *  Password Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check password data and return errors or continue
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.body.account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id: req.body.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
  }
  next()
}

module.exports = {
    ...validate, // Spread all validate properties
    classificationRules, 
    checkClassificationData,
    inventoryRules,
    checkInventoryData,
    checkUpdateData
}