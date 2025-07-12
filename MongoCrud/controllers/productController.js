const Product=require("../models/Product");

const getAllProducts=async (req,res)=>{
    try{
      const products= await Product.find();
      res.json(products);
    }catch(err){
        res.status(500).json({message:"Error in fetching data",error:err})
        // console.log("Error in fetching data",err)
    }
}
module.exports=getAllProducts;