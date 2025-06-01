const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// Add to controllers/invController.js
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      throw new Error('Inventory item not found');
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

module.exports = invCont