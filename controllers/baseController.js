const utilities = require("../utilities/");

const baseController ={};

async function buildHome(req, res, next) {
  try {
    let nav = await utilities.getNav(); // Fetch navigation data

    // notice messages
    req.flash("notice", "This is a flash message.")
  

    res.render("index", {
      title: "Home",
      imagePath: "/images/site/own_today.png", // Main DeLorean image
      imagePath1: "/images/upgrades/flux-cap.png", // Flux capacitor
      imagePath2: "/images/upgrades/flame.jpg", // Flame decals
      imagePath3: "/images/upgrades/bumper_sticker.jpg", // Bumper stickers
      imagePath4: "/images/upgrades/hub-cap.jpg", // Hub caps
      nav
    });
  } catch (err) {
    next(err);
  }
}

/* *********************************
 * Task 3 Trigger a 500 Server Error
 * ****************************** */
baseController.triggerError = async function (req, res, next) {
  throw new Error("500 Server Error")  
}

module.exports = { buildHome };


