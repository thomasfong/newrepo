// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require('../utilities');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to routes inventoryRoute.js
router.get("/detail/:inv_id", invController.buildByInventoryId);

router.get('/delete/:inv_id', 
  utilities.handleErrors(invController.buildDeleteConfirmation))

// POST route to handle the actual deletion
router.post('/delete/:inv_id', utilities.handleErrors(invController.deleteInventoryItem));

module.exports = router

