const Blog =require("../models/Blogs")

exports.createBlog=async (req,res)=>{
    try{
     const {title,content}=req.body;
     const blog=new Blog({
        title,
        content,
        author:req.user.id
     });
     console.log(blog,"blog data 111111111")
     await blog.save();
     res.status(201).json(blog);
     
    }catch(err){
       res.status(400).json({message:"Blog Not Created",error:err});
    }
}

exports.getBlogs=async (req,res)=>{
    try{
     const blogs =await Blog.find();
     req.status(200).json(blogs)
    

    }catch(err){
         res.status(500).json({error:err});
    }
}
