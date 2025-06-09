
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invChecks = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", 
utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 * Assignment 3, Task 3
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.throwError)
)

/* ****************************************
 * Build Management View Route
 * Assignment 4, Task 1
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/",
  //utilities.checkAccountType,
  utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.buildManagementView)
)

/* ****************************************
 * Build add-classification View Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/newClassification",
  //utilities.checkAccountType,
  utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.newClassificationView)
)


/* ****************************************
 * Process add-classification Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
  "/addClassification",
  //utilities.checkAccountType,
  invChecks.classificationRule(),
  invChecks.checkClassificationData,
  utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-vehicle View Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/newVehicle",
  //utilities.checkAccountType,
  utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.newInventoryView)
)

/* ****************************************
 * Process add-vehicle Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
  "/addInventory",
  //utilities.checkAccountType,
  invChecks.newInventoryRules(),
  invChecks.checkInventoryData,
  utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.addInventory)
)

// Administrative routes (require Employee or Admin)
// Route to return inventory by classification as JSON
router.get("/getInventory/:classification_id",utilities.restrictToEmployeeOrAdmin, utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver edit inventory view
router.get("/edit/:inv_id",utilities.restrictToEmployeeOrAdmin, utilities.handleErrors(invController.editInventoryView))

// route to deliver the edit changes to the database.
router.post("/update/",utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.updateInventory))

// Route to deliver delete inventory view
router.get("/delete/:inv_id",utilities.restrictToEmployeeOrAdmin, utilities.handleErrors(invController.deleteconfirmView))

// route to deliver the edit changes to the database.
router.post("/delete/",utilities.restrictToEmployeeOrAdmin,utilities.handleErrors(invController.deleteInventory))


module.exports = router;