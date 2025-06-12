const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 * Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      throw new Error("Inventory item not found");
    }
    const detailHTML = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build Inventory Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      utilities.rebuildNav();
      req.flash(
        "notice",
        `Classification "${classification_name}" was successfully added.`
      );
      res.redirect("/inv/");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the classification addition failed.");
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    });
  }
};

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} was successfully added.`
      );
      res.redirect("/inv/");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the vehicle addition failed.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      ...req.body
    });
  }
};

/* ***************************
 * Process inventory deletion
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const result = await invModel.deleteInventoryItem(inv_id);
    if (result) {
      req.flash("notice", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
    } else {
      throw new Error("Deletion failed");
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    
    if (invData.length > 0 && invData[0].inv_id) {
      return res.json(invData);
    } else {
      return res.json({ message: "No vehicles found" });
    }
  } catch (error) {
    next(error);
  }
};

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
};

/* ***************************
 * Process inventory update
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body;

    const result = await invModel.updateInventory(
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash("notice", "The vehicle was successfully updated.");
      res.redirect("/inv/");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    
    req.flash("notice", "Sorry, the update failed.");
    res.status(500).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationList,
      errors: null,
      ...req.body
    });
  }
};

/* ***************************
 *  Update Inventory Data
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
    classification_id,
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
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
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

/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await invModel.getInventoryById(inv_id);
    let nav = await utilities.getNav();
    res.render("./inventory/delete-confirm", {
      title: "Delete " + vehicleData.inv_make + " " + vehicleData.inv_model,
      nav,
      vehicle: vehicleData,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process inventory deletion
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const result = await invModel.deleteInventoryItem(inv_id);
    if (result) {
      req.flash("notice", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
    } else {
      throw new Error("Deletion failed");
    }
  } catch (error) {
    next(error);
  }
};

// Add this to your inventory controller
invCont.handleErrors = (err, req, res, next) => {
  if (err.message === 'Not authorized') {
    req.flash('notice', 'You are not authorized to access this page.');
    return res.redirect('/account/login');
  }
  next(err);
};

module.exports = invCont;