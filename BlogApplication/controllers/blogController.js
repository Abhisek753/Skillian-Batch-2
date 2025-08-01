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
exports.getBlogsById=async (req,res)=>{
    try{
      const blog=await Blog.findById(req.params.id);
      if(!blog){
        return res.status(404).json({message:"No blog found with this id"})
      }
      res.status(200).json(blog);
    }catch(err){
              res.status(500).json({error:err});
    }
}

exports.updateBlogs=async (req,res)=>{
    try{
      const blog=await Blog.findById(req.params.id);
      console.log(blog);
      if(!blog){
        return res.status(404).json({message:"No blog found with this id"})
      }
     console.log(blog.author.toString(),"id compare",req.user.id)
     if(blog.author.toString()!==req.user.id){
        return res.status(403).json({error:"Unauthorized"})
     };
     blog.title=req.body.title ||  blog.title;
     blog.content=req.body.content ||  blog.content;
     await blog.save();
    res.status(200).json(blog);

    }catch(err){
              res.status(500).json({error:err});
    }
}
