const express = require("express");
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:customer_id", getCustomerById);
router.post("/", createCustomer);
router.put("/:customer_id", updateCustomer);
router.delete("/:customer_id", deleteCustomer);

module.exports = router;
