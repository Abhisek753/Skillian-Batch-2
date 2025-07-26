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

const addNewProduct=async (req,res)=>{
  const {name,price,description}=req.body;
  try{
    const newProduct=await Product.create({name,price,description});
    res.status(201).json({message:"Product Added Successfully",product:newProduct})

  }catch(err){
    res.status(500).json({message:"Error in adding products",error:err})
  }

}

const updateProduct=async (req,res)=>{
   const {id}=req.params;
   const {name,price,description}=req.body;

   try{
    const updateProduct= await Product.findByIdAndUpdate(id,{name,price,description},{new:true});
     if(!updateProduct){
      return res.status(400).json({message:"Product not found"})
     };
     res.json({message:"Product updated Successfully",Product:updateProduct});

   }catch(err){
    res.status(500).json({message:"Error in updating product",error:err})
   }

}

const deleteProduct=async (req,res)=>{
  const {id}=req.params;
  try{
   const deletedProduct=await Product.findByIdAndDelete(id);
    if(!deletedProduct){
      return res.status(404).json({message:"Product not found"});
    }
   res.json({message:"Product deleted successfully",product:deletedProduct});
  }catch(err){
      res.status(500).json({message:"Error in deleting product",error:err})
  }

}

module.exports={getAllProducts,addNewProduct,updateProduct,deleteProduct};