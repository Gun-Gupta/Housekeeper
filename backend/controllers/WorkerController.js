const Worker = require("../models/Worker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Worker Register
const registerWorker = async (req, res) => {
  try {
    const {
      profile,
      fullname,
      phone,
      gender,
      age,
      dob,
      password,
      confirmPassword,
      serviceCategory,
      address,
    } = req.body;

    if (
      !profile ||
      !fullname ||
      !phone ||
      !gender ||
      !age ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    const existingWorker = await Worker.findOne({ phone });

    if (existingWorker) {
      return res.status(400).json({
        message: "Worker already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      profile,
      fullname,
      phone,
      gender,
      age,
      dob,
      password: hashedPassword,
      serviceCategory,
      address,
      isVerified: false,
    });

    res.status(201).json({
      message: "Worker registered successfully. Please verify OTP.",
      workerId: worker._id,
      phone: worker.phone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Worker registration failed",
      error: error.message,
    });
  }
};

// Worker Login
const loginWorker = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    const worker = await Worker.findOne({ phone });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    if (worker.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked by admin",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, worker.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: worker._id,
        role: worker.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "365d",
      }
    );

    res.status(200).json({
      message: "Worker login successful",
      token,
      user: {
        id: worker._id,
        fullname: worker.fullname,
        phone: worker.phone,
        role: worker.role,
        isVerified: worker.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Worker login failed",
      error: error.message,
    });
  }
};

// Get All Workers
const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select('-password');
    res.status(200).json({ workers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workers', error: error.message });
  }
};

// Get Worker By ID
const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json({ worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Worker
const updateWorker = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    delete updates.confirmPassword;
    const worker = await Worker.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json({ message: 'Worker updated', worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Worker
const deleteWorker = async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block / Unblock Worker
const blockWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    worker.isBlocked = !worker.isBlocked;
    await worker.save();
    res.status(200).json({ message: `Worker ${worker.isBlocked ? 'blocked' : 'unblocked'}`, worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerWorker,
  loginWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  blockWorker,
};