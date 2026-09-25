const Otp = require("../models/Otp");
const axios = require("axios");


// ============================
// Send OTP
// ============================

const sendOtp = async (req, res) => {

   try {

      const { phone } = req.body;

      if (!phone) {
         return res.status(400).json({
            message: "Phone number required"
         });
      }

      // Generate 6 digit OTP

      const generatedOtp =
         Math.floor(100000 + Math.random() * 900000);

      // Delete old OTPs for same number

      await Otp.deleteMany({ phone });

      // Save OTP in DB

      await Otp.create({
         phone,
         otp: generatedOtp,
         expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      // ============================
      // Send SMS using Fast2SMS
      // ============================

      try {

         const response = await axios.get(
            "https://www.fast2sms.com/dev/bulkV2",
            {
               params: {
                  authorization: process.env.FAST2SMS_API_KEY,
                  route: "v3",
                  sender_id: "TXTIND",
                  message: `Your OTP is ${generatedOtp}`,
                  language: "english",
                  numbers: phone
               }
            }
         );

         console.log("SMS RESPONSE:", response.data);

      } catch (smsError) {

         console.log(
            "SMS ERROR:",
            smsError.response?.data || smsError.message
         );

         // Continue anyway for development
      }

      // Return OTP for development/testing

      res.status(200).json({
         message: "OTP sent successfully",
         otp: generatedOtp
      });

   } catch (error) {

      console.log("SEND OTP ERROR:", error);

      res.status(500).json({
         message: "Failed to send OTP",
         error: error.message
      });
   }
};



// ============================
// Verify OTP
// ============================

const verifyOtp = async (req, res) => {

   try {

      const { phone, otp } = req.body;

      if (!phone || !otp) {
         return res.status(400).json({
            message: "Phone and OTP are required"
         });
      }

      // Find OTP

      const otpData = await Otp.findOne({
         phone,
         otp
      });

      if (!otpData) {
         return res.status(400).json({
            message: "Invalid OTP"
         });
      }

      // Check expiry

      if (otpData.expiresAt < new Date()) {

         await Otp.deleteOne({ _id: otpData._id });

         return res.status(400).json({
            message: "OTP expired"
         });
      }

      // Delete OTP after verification

      await Otp.deleteOne({
         _id: otpData._id
      });

      // Update Worker isVerified status
      const Worker = require("../models/Worker");
      await Worker.findOneAndUpdate({ phone }, { isVerified: true });

      res.status(200).json({
         message: "OTP verified successfully"
      });

   } catch (error) {

      console.log("VERIFY OTP ERROR:", error);

      res.status(500).json({
         message: "OTP verification failed",
         error: error.message
      });
   }
};

module.exports = {
   sendOtp,
   verifyOtp
};