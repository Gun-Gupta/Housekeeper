const Moognose = require("mongoose");

const clientSchema = new Moognose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide your fullname"],
    trim: true,
  },

  phone:{
    type: String,
    required: [true, "Please provide your phone number"],
    trim: true,
    unique: true
  },

  password:{
    type:String,
    required:true,
    minlength:6
  },

  CategoryNeeded:{
    type: String,
    enum: [
      "Cooking",
      "Cleaning",
      "Gardening",
      "Babysitting",
      "Driver",
    ],
    default: "Cooking",
  },

  isBlocked:{
    type:Boolean,
    default:false
  },

  profile:{
    type:String,
    default:""
  },

  address:{
    type:String,
    required:true,
    trim:true
  },

  role:{
    type:String,
    default:"client"
  }
});

module.exports = Moognose.model("Client", clientSchema);