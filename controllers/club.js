const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Club = require("../models/club.js");

router.get("/:clubId", (req, res) => {
  res.render("clubs/show.ejs");
});

module.exports = router;
