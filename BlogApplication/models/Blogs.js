const mongoose =require("mongoose");

const blogSchema= new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,require:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},

});
module.exports=mongoose.model("Blog",blogSchema);