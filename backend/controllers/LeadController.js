const Lead = require("../models/Lead");


// ============================
// Create Lead
// ============================

const createLead = async (req, res) => {
  try {

    const {
      clientName,
      phone,
      serviceCategory,
      address,
      description,
      budget,
      createdBy
    } = req.body;

    // Validation

    if (
      !clientName ||
      !phone ||
      !serviceCategory ||
      !address
    ) {
      return res.status(400).json({
        message: "All required fields are mandatory"
      });
    }

    // Create Lead

    const lead = await Lead.create({
      clientName,
      phone,
      serviceCategory,
      address,
      description,
      budget,
      createdBy
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead
    });

  } catch (error) {

    console.log("CREATE LEAD ERROR:", error);

    res.status(500).json({
      message: "Lead creation failed",
      error: error.message
    });
  }
};



// ============================
// Get All Leads
// ============================

const getAllLeads = async (req, res) => {

  try {

    const leads = await Lead.find()
      .populate("assignedWorker")
      .populate("createdBy");

    res.status(200).json({
      total: leads.length,
      leads
    });

  } catch (error) {

    console.log("GET LEADS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message
    });
  }
};



// ============================
// Assign Worker
// ============================

const assignWorker = async (req, res) => {

  try {

    const { workerId } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        assignedWorker: workerId,
        status: "assigned"
      },
      { new: true }
    );

    res.status(200).json({
      message: "Worker assigned successfully",
      lead
    });

  } catch (error) {

    console.log("ASSIGN WORKER ERROR:", error);

    res.status(500).json({
      message: "Failed to assign worker",
      error: error.message
    });
  }
};



// ============================
// Complete Lead
// ============================

const completeLead = async (req, res) => {

  try {

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed"
      },
      { new: true }
    );

    res.status(200).json({
      message: "Lead marked as completed",
      lead
    });

  } catch (error) {

    console.log("COMPLETE LEAD ERROR:", error);

    res.status(500).json({
      message: "Failed to complete lead",
      error: error.message
    });
  }
};



// ============================
// Cancel Lead
// ============================

const cancelLead = async (req, res) => {

  try {

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled"
      },
      { new: true }
    );

    res.status(200).json({
      message: "Lead cancelled",
      lead
    });

  } catch (error) {

    console.log("CANCEL LEAD ERROR:", error);

    res.status(500).json({
      message: "Failed to cancel lead",
      error: error.message
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  assignWorker,
  completeLead,
  cancelLead
};