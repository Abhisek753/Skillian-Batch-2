const mongoose=require("mongoose");
const connectDB=async ()=>{
    try{
     await mongoose.connect(process.env.MONGODB_URI);
     console.log("mongodb is connected successfully")
    }catch(err){
      console.log("MongoDb connection failed",err)
    }
}
module.exports=connectDB;