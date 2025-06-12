// inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities');
const validate = require('../utilities/account-validation');
const authMiddleware = require('../utilities/authMiddleware');

// Public routes (no auth required)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Admin routes (require Employee/Admin)
router.get("/management", 
  authMiddleware.requireEmployeeOrAdmin, 
  utilities.handleErrors(invController.buildManagement)
);

router.get("/add-classification", 
  authMiddleware.requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post("/add-classification",
  authMiddleware.requireEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", 
  authMiddleware.requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post("/add-inventory",
  authMiddleware.requireEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/edit/:inv_id", 
  authMiddleware.requireEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
);

router.post("/update/", 
  authMiddleware.requireEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:inv_id", 
  authMiddleware.requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirmation)
);

router.post("/delete/:inv_id", 
  authMiddleware.requireEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
);

// JSON route (typically used by AJAX, protect if needed)
router.get("/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;