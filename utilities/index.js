const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryDetail = async function(data) {
  return `
    <div class="inventory-detail">
      <div class="detail-image">
        <img src="${data.inv_image}" 
             alt="${data.inv_make} ${data.inv_model}" 
             class="img-responsive">
      </div>
      <div class="detail-info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <div class="price-mileage">
          <p class="price">$${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
          <p class="mileage">${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
        </div>
        <div class="description">
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
        </div>
      </div>
    </div>
  `;
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)

module.exports = Util

