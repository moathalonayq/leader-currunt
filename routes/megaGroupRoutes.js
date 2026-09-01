const express = require("express");
const router = express.Router();
const megaGroupModel = require("../models/megaGroupModel");

router.get("/", async (req, res, next) => {
  try {
    const megaGroups = await megaGroupModel.getMegaGroupDetails();
    res.render("mega-groups", { 
      pageTitle: "المجموعات",
      activeNav: "mega-groups",
      megaGroups 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

