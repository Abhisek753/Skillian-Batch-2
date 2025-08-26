const express=require("express");
require("dotenv").config();
const cors=require("cors");
const PORT=process.env.PORT;
const app=express();
app.use(cors());
app.use(express.json());
const authRoutes =require("./routes/authRoutes");
const connectDB = require("./config/db");

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome to my e commerce project",
        status:"Server is running"
    })
});
app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);

connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is runnng ${PORT}`)
})
})

