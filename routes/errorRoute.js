const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities")

router.get("/trigger-error", utilities.handleErrors(errorController.errorTest));

// module.exports = {router,errorController} 

module.exports = router;
