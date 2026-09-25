const Mongoose = require("mongoose");

const leadSchema = new Mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    serviceCategory: {
      type: String,
      required: true,
      enum: [
        "Cooking",
        "Cleaning",
        "Gardening",
        "Babysitting",
        "Driver",
        "All Services",
      ],
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    budget: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "new",
        "payment_pending",
        "assigned",
        "completed",
        "cancelled",
        "rejected"
      ],
      default: "new",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentAmount: {
      type: Number,
      default: 99,
    },

    assignedWorker: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },

    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Lead", leadSchema);