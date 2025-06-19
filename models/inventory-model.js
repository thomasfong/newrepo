
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 *  Unit 3, MVC: Get Started Activity
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 *  Get all inventory and classification_name by classification_id
 *  Unit 3, Build the Inventory route, controller and model activity
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory and classification data by inv_id
 *  Assignment 3, Task 1
 * ************************** */
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error(error)
  }
}

/* ***************************
 *  Insert new classification
 *  Assignment 4, Task 2
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Insert new vehicle
 *  Assignment 4, Task 3
 * ************************** */
async function addInventory(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const data = await pool.query(sql, [
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
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
/***************************
 * delete inventory data
 * this is in team 05 unit 5 2025
 ********************************/
async function deleteInventoryById(inv_id) {
  try {
    const result = await pool.query(
      'DELETE FROM inventory WHERE inv_id = $1 RETURNING *',
      [inv_id]
    )
    console.log("Delete result for inv_id", inv_id, ":", result.rows[0])
    if (result.rowCount === 0) {
      console.log("No inventory item found with inv_id:", inv_id)
      return { success: false, message: "No inventory item found with ID " + inv_id }
    }
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Database error in deleteInventoryById:", error.message, error.stack)
    let message = "Failed to delete inventory item due to a server error."
    if (error.message.includes("foreign key constraint")) {
      message = "Cannot delete item due to related records (e.g., in cart or orders)."
    }
    return { success: false, message }
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory,updateInventory,deleteInventoryById }