const express=require("express");
const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET || "yoursecret";
const bcrypt=require("bcryptjs")
const User =require("../models/User")


router.post("/register",async (req,res)=>{
  const {username,password}=req.body;

  try{
     const hashed= await bcrypt.hash(password,10);
     const user =await User.create({username,password:hashed});
     res.status(201).json({message:"User Registered",user});
  }catch(err){
      res.status(400).json({message:"Error in registration",error:err})
  }


})
router.post("/login",async (req,res)=>{
 const {username,password}=req.body;

 try{
   const user=await User.findOne({username});
   if(!user){
    return res.status(404).json({message:"User not found"})
   };
   const isMatch= await bcrypt.compare(password,user.password);
   console.log(isMatch,"1111111");
   //generate the jwt tokens
   if(!match){
    return res.status(401).json({message:"Invalid Credential"});
   }
 }catch{

 }

})

module.exports=router;