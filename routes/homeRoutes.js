const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.showHome);
router.get("/individual", homeController.showIndividual);

module.exports = router;

