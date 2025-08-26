
const Product=require("../models/Product");
const fs=require("fs")
exports.createProduct=async (req,res)=>{
try{
 const {name,description,category,price,stock}=req.body;
 console.log(name,description,category,price,stock)
 const image=req.files ?req.files.map(file=>file.path):[];
 let rating=[];
  if(req.body.rating){
    try{
      rating=JSON.parse(req.body.rating)
    }catch(err){
       rating=[];
    }
  }

  const product= new Product({
    name,
    description,
    price,
    category,
    stock,
    image,
    rating,
    createdBy:req.user.id
  })
  await product.save();
  res.status(201).json({message:"Product Created Successfully",product})

}catch(error){
    if(req.files){
        req.files.forEach(files=>{
            fs.unlink(files.path,err=>{
                if(err){
                    console.log("Error in deleting the files",err)
                }
            })
        })
    }
    res.status(400).json({message:"Error in creating product"})
}
  
};
exports.getProducts=async (req,res)=>{
  try{
    const {category,search,sort}=req.query;
    const query={};
    if(category){
      query.category=category;
    }
     if(search){
      query.$text={$search:search};
    }
    //handle sorting
    let sortoption={createdAt:-1}


    // const products=await Product.find(query).polpulate("category","name description")
    // .sort(sortoption);
   
   const products=await Product.find(query)
    res.json(products)
  } catch(err){
      res.status(500).json({message:"Error in fetching product",error:err})
  } 
  
};
exports.getProductById=async (req,res)=>{
    
  
};
exports.updateProduct=async (req,res)=>{
    
  
};
exports.deleteProduct=async (req,res)=>{
    
  
};
