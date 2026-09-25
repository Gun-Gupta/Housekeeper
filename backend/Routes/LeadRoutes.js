const express = require("express");

const router = express.Router();

const {
  createLead,
  getAllLeads,
  assignWorker,
  completeLead,
  cancelLead
} = require("../controllers/leadController");

router.post("/create", createLead);
router.get("/all", getAllLeads);
router.put("/assign/:id", assignWorker);
router.put("/complete/:id", completeLead);
router.put("/cancel/:id", cancelLead);
router.put("/reject/:id", cancelLead);

module.exports = router;