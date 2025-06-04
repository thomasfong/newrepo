const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildSingleVehicleDisplay = async (vehicle) => {
  // Format price as USD with commas and currency symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format mileage with commas
  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  // Use fallback image if inv_image is missing or empty
  const imageSrc = vehicle.inv_image && vehicle.inv_image !== ''
    ? vehicle.inv_image
    : '/images/vehicle-placeholder.jpg';

  // Build HTML structure
  let svd = '<section id="vehicle-display" role="region" aria-label="Vehicle Details">';
  svd += '<div class="vehicle-detail-container">';
  svd += '<div class="vehicle-image">';
  svd += `<img src="${imageSrc}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />`;
  svd += '</div>';
  svd += '<div class="vehicle-info">';
  svd += `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  svd += '<div class="vehicle-specs">';
  svd += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  svd += `<p><strong>Price:</strong> ${formatCurrency(vehicle.inv_price)}</p>`;
  svd += `<p><strong>Mileage:</strong> ${formatNumber(vehicle.inv_miles)} miles</p>`;
  svd += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  svd += `<p><strong>Class:</strong> ${vehicle.classification_name}</p>`;
  svd += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  svd += '</div>';
  svd += '<a href="/contact" class="cta-button" role="button" tabindex="0">Contact Dealer</a>';
  svd += '</div>';
  svd += '</div>';
  svd += '</section>';
  return svd;
}
// new changes added 03.06.2025.
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

