const User =require("../models/User")

exports.getUsers=async ()=>{
    return await User.find();
}

exports.addUserSocket=async (userData)=>{
   const user=new User(userData);
   await user.save();
   return user
}
