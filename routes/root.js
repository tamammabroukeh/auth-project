const express = require("express");
const router = express.Router();
const path = require("path");

// ^/ start with a slash
// /$ end with a slash
// | or
router.get("^/$|/index(.html)?", (req, res) => {
  // console.log("hello");
  // res.send("hello");
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
