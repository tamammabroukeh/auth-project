const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/VerifyRoles");
router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.createEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);
module.exports = router;
