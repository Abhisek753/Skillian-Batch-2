
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
    try{
      const product= await Product.findById(req.params.id);
      if(!product){
        return   res.status(404).json({message:"Product not found"})
      }
      res.status(200).json({message:"Got Single Product",product})

    }catch(err){
      res.status(500).json({message:"Error in getting the product"})
    }
  
};
exports.updateProduct=async (req,res)=>{
    try{
      const {name,description,category,price,stock}=req.body;
      const product= await Product.findById(req.params.id);
      if(!product){
        return   res.status(404).json({message:"Product not found"})
      }
      console.log("Found Product:", product);
      product.name=name || product.name;
      product.description=description || product.description;
      product.category=category || product.category;
      product.price=price || product.price;
      product.stock=stock || product.stock;
      console.log("Updated Product:", product);
      if(req.files && req.files.length>0){
         product.image.forEach(image=>{
          const imagePath=path.join(__dirname," ",image);
          if(fs.existsSync(imagePath)){
            fs.unlink(imagePath,err=>{
              if(err){
                console.log("Error in deleting the files",err)
              }
            })
          }
         })
         product.image=req.files.map(file=>file.path);
      }
    const updateProduct= await product.save();
      res.status(200).json({message:"Product Updated Successfully",product:updateProduct})

    }catch(err){
      res.status(500).json({message:"Error in updating the product"})
    }
  
};
exports.deleteProduct=async (req,res)=>{
    try{
      const product= await Product.findById(req.params.id);
      if(!product){
        return   res.status(404).json({message:"Product not found"})
      }
      //delete images from uploads folder
      if(product.image && product.image.length>0){
        product.image.forEach(imagePath=>{
            fs.unlink(imagePath,err=>{
                if(err){
                    console.log("Error in deleting the files",err)
                }
            })
        })
      }
      res.status(200).json({message:"Product Deleted Successfully",product})

    }catch(err){
      res.status(500).json({message:"Error in deleting the product",error:err})
    }
  
};
