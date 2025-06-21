
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    let nav = await utilities.getNav()

    if (!data || data.length === 0) {
        res.render("./inventory/classification", {
            title: "NO VEHICLES HAVE BEEN FOUND",
            nav,
            grid: "There has not been any vehicles created in this classification."
        })
        return
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await invModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

/* ****************************************
 *  Process intentional error
 *  Assignment 3, Task 3
 * ************************************ */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}

/* ***************************
 *  Build vehicle management view
 *  Assignment 4, Task 1
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}


/* ***************************
 * Build new classification view
 * Assignment 4, Task 2
 * ************************** */
invCont.newClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}


/* ***************************
 * Process new classification insert
 * Assignment 4, Task 2
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const insertResult = await invModel.addClassification(classification_name)

  if (insertResult) {
    nav = await utilities.getNav()
    req.flash("message success", `The ${insertResult.classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("message warning", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}


/* ***************************
 * Build new inventory view
 * Assignment 4, Task 3
 * ************************** */
invCont.newInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect: classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Process new inventory item insert
 * Assignment 4, Task 3
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const insertResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (insertResult) {
    const itemName = insertResult.inv_make + " " + insertResult.inv_model
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("message success", `The ${itemName} was successfully added.`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    })
  } else {
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("message warning", "Sorry, the insert failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect: classificationSelect,
      errors: null,
    })
  }
}

/* *************************************
 *  Return Inventory by Classification As JSON
 *  Unit 5, Select Inv Item activity
 * *********************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit item view
 *  Unit 5, Update Step 1 Activity
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Vehicle Data
 *  Unit 5, Update Step 2 Activity
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("message success", itemName+' was successfully updated.')
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("message warning", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

 /***************************
 *  Build delete item view
 *  Unit 5, delete Step 1 Activity
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.deleteconfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.deleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  console.log("Item data for delete confirmation:", itemData)
  if (!itemData) {
    req.flash("notice", "Inventory item not found.")
    return res.redirect("/inv/")
  }
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Process Inventory Deletion
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  console.log("Deleting inventory with inv_id:", inv_id, "data:", req.body)

  const deleteResult = await invModel.deleteInventoryById(parseInt(inv_id))

  if (deleteResult.success) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("message success", `${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(parseInt(classification_id))
    const itemName = `${inv_make} ${inv_model}`
    req.flash("message warning", deleteResult.message || "Sorry, the delete failed.")
    res.status(400).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      classificationSelect,
      errors: [{ msg: deleteResult.message || "Delete failed." }],
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



module.exports = invCont