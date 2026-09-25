const Mongoose = require("mongoose");

const otpSchema = new Mongoose.Schema({

   phone:{
      type:String,
      required:true
   },

   otp:{
      type:String,
      required:true
   },

   expiresAt:{
      type:Date,
      required:true
   }

},{timestamps:true});

module.exports = Mongoose.model("Otp",otpSchema);