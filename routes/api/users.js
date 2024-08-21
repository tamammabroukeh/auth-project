const express = require("express");
const ROLES_LIST = require("../../config/roles_list");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/VerifyRoles");
router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .post(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);
router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

module.exports = router;
