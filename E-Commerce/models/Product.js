 const mongoose=require("mongoose");
 const productSchema= new mongoose.Schema({
    name:{type:String,
        required:true,
        },
    category:{type:String,required:true},
    // category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true}
    description:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true},
    image:[{type:String}],
    rating:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,  ref:"User",required:true},
            rating:{type:Number,required:true,min:1,max:5},
            review:{type:String}

        },],
  createdBy:{type:mongoose.Schema.Types.ObjectId}
 });
 module.exports=mongoose.model("Product",productSchema);
