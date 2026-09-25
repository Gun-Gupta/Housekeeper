const Mongoose = require('mongoose');

const workerSchema = new Mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"Please provide your fullname"],
        trim:true
    },

    phone:{
        type:String,
        required:[true,"Please provide your phone number"],
        trim:true,
        unique:true
    },

    gender:{
        type:String,
        required:true,
        enum:['male','female','other']
    },

    age:{
        type:Number,
        required:true,
        min:18,
        max:65
    },

    dob:{
        type:Date,
        required:true
    },

    password:{
        type:String,
        required:true,
        minlength:6
    },

    profile:{
        type:String,
        default:""
    },

    serviceCategory: {
      type: String,
      enum: [
        "Cooking",
        "Cleaning",
        "Gardening",
        "Babysitting",
        "Driver",
        "All Services",
      ],
      default: "All Services",
    },

    address:{
        type:String,
        default:"",
        trim:true
    },
    
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "inactive"],
      default: "available",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "worker",
    },

  },
  { timestamps: true }
);

module.exports = Mongoose.model("Worker", workerSchema);