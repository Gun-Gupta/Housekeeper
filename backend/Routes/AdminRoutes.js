const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getAdminStats,
} = require("../controllers/AdminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/stats", getAdminStats);

module.exports = router;