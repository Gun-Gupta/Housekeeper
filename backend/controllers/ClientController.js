const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Client Register
const registerclient = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      password,
      confirmPassword,
      CategoryNeeded,
      address,
    } = req.body;

    // Validation
    if (
      !fullname ||
      !phone ||
      !password ||
      !confirmPassword ||
      !CategoryNeeded ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Password Match Check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    // Existing Client Check
    const existingClient = await Client.findOne({ phone });

    if (existingClient) {
      return res.status(400).json({
        message: "Client already exists with this phone number",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Client
    const client = await Client.create({
      fullname,
      phone,
      password: hashedPassword,
      CategoryNeeded,
      address,
    });

    // Response
    res.status(201).json({
      message: "Client registered successfully",
      clientId: client._id,
      phone: client.phone,
    });

  } catch (error) {
    console.error("Error registering client:", error);

    res.status(500).json({
      message: "Server error while registering client",
      error: error.message,
    });
  }
};

// Client Login
const loginClient = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    // Find Client
    const client = await Client.findOne({ phone });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // Block Check
    if (client.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked by admin",
      });
    }

    // Password Check
    const isPasswordCorrect = await bcrypt.compare(
      password,
      client.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // JWT Token
    const token = jwt.sign(
      {
        id: client._id,
        role: client.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "365d",
      }
    );

    // Success Response
    res.status(200).json({
      message: "Client login successful",
      token,
      user: {
        id: client._id,
        fullname: client.fullname,
        phone: client.phone,
        role: client.role,
        isVerified: client.isVerified,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Client login failed",
      error: error.message,
    });
  }
};

// Get All Clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().select('-password');
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Client
const updateClient = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    delete updates.confirmPassword;
    const client = await Client.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json({ message: 'Client updated', client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Client
const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block / Unblock Client
const blockClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    client.isBlocked = !client.isBlocked;
    await client.save();
    res.status(200).json({ message: `Client ${client.isBlocked ? 'blocked' : 'unblocked'}`, client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerclient,
  loginClient,
  getAllClients,
  updateClient,
  deleteClient,
  blockClient,
};