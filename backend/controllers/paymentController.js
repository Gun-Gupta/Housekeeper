const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Payment = require("../models/Payment");
const Lead = require("../models/Lead");


// ===================================
// CREATE ORDER
// ===================================

const createPaymentOrder = async (req, res) => {
  try {
    const { leadId } = req.body;

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const options = {
      amount: 99 * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      worker: req.user.id,
      lead: leadId,
      amount: 99,
      razorpay_order_id: order.id,
    });

    lead.status = "payment_pending";
    lead.assignedWorker = req.user.id;

    await lead.save();

    res.status(200).json({
      success: true,
      order,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ===================================
// VERIFY PAYMENT
// ===================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      leadId,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      razorpay_order_id,
    });

    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "paid";

    await payment.save();

    const lead = await Lead.findById(leadId);

    lead.paymentStatus = "paid";
    lead.status = "assigned";

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Payment successful and lead assigned",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};