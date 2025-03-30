const express = require("express");
const {
  getAllStaff,
  getStaffByID,
  createNewStaff,
  updateStaffByID,
  deleteStaffByID,
} = require("../controllers/staffController");

const router = express.Router();

router.get("/", getAllStaff);
router.get("/:id", getStaffByID);
router.post("/", createNewStaff);
router.put("/:id", updateStaffByID);
router.delete("/:id", deleteStaffByID);

module.exports = router;
