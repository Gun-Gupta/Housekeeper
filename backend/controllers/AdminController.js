const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================
// Register Admin
// ============================

const registerAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    // Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.log("ADMIN REGISTER ERROR:", error);

    res.status(500).json({
      message: "Admin registration failed",
      error: error.message,
    });
  }
};

// ============================
// Login Admin
// ============================

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.log("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      message: "Admin login failed",
      error: error.message,
    });
  }
};

// ============================
// Get Admin Stats
// ============================

const getAdminStats = async (req, res) => {
  try {
    const Worker = require("../models/Worker");
    const Client = require("../models/Client");
    const Lead = require("../models/Lead");

    const totalWorkers = await Worker.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalLeads = await Lead.countDocuments();

    // Sum of budget/paymentAmount for paid leads
    const paidLeads = await Lead.find({ paymentStatus: "paid" });
    const totalRevenue = paidLeads.length * 99;

    const acceptedRequests = await Lead.countDocuments({
      status: { $in: ["assigned", "completed"] },
    });
    const rejectedRequests = await Lead.countDocuments({
      status: { $in: ["cancelled", "rejected"] },
    });

    res.status(200).json({
      totalWorkers,
      totalClients,
      totalLeads,
      totalRevenue,
      acceptedRequests,
      rejectedRequests,
    });
  } catch (error) {
    console.log("GET ADMIN STATS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminStats,
};