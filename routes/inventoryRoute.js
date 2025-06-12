// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities');
const validate = require('../utilities/account-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to update inventory item
router.post(
    "/update/", 
    validate.inventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view (GET)
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmation));

// Route to handle inventory deletion (POST)
router.post("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryItem));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to handle adding new classification
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;