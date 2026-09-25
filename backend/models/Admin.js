const Mongoose = require('mongoose');

const adminSchema = new Mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Please provide your fullname"],
        trim:true
    },

    email:{
        type:String,
        required:[true,"Please provide your email"],
        trim:true,
        unique:true
    },

    phone:{
        type:String,
        required:[true,"Please provide your phone number"],
        trim:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        minlength:6
    },

    role:{
    type:String,
    default:"admin"
    }

});

module.exports = Mongoose.model("Admin",adminSchema);