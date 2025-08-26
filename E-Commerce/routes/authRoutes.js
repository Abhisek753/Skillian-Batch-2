const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET=process.env.JWT_SECRET
router.post("/register",async (req,res)=>{
    const {username,role,password,address,email,contactnumber}=req.body;
    console.log(username,role,password,address,email,contactnumber);
   
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"User already Exist"
            })
        }
        const hashed= await bcrypt.hash(password,10);
        console.log(hashed,"hashed password");
        const user= await User.create({username,role,address,email,contactnumber,password:hashed});
        res.status(200).json({message:"User Registered",user:user});
    }catch(err){
        res.status(400).json({message:"User registration failed",error:err})
    }
} );
router.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
   
    try{
      const user= await User.findOne({email});
      if(!user){
        res.status(404).json({message:"User not found"});
      }
      //compare the password
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
      return res.status(404).json({message:"Invalid Password"});
      }
      const token=jwt.sign({id:user._id,role:user.role},JWT_SECRET,{expiresIn:"1h"});
      res.status(200).json({message:"Login Successfull",token});

    }catch(err){
        res.status(400).json({message:"User Login Failed",error:err})
    }
} );


module.exports=router;

