 const mongoose=require("mongoose");
 const userSchema= new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["user","admin"],default:"user"},
    address:{
        street:{type:String},
        city:{type:String},
        state:{type:String},
        pincode:{type:String}
    },
    email:{type:String,required:true},
    contactnumber:{type:String,required:true}

 });
 module.exports=mongoose.model("User",userSchema);
