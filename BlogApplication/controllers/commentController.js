const Comment =require("../models/Comment");
const Blog=require("../models/Blogs");

exports.createComment=async (req,res)=>{
    try{
   const  {text,blogId}=req.body;
   const blog=await Blog.findById(blogId);
   if(!blog){
    return res.status(404).json({message:"Blog not found"});
   }

   const comment =new Comment({
    text,
    user:req.user.id,
    blog:blogId
   });
   await comment.save();
   blog.comments.push(comment._id);
   await blog.save();
  
   await comment.populate("user","username role")

    }catch(err){
       res.status(400).json({message:"Comment creation failed",error:err})
    }
}

exports.getCommentsByBlog=async (req,res)=>{

    try{
        const {blogId}= req.params;
        console.log(blogId,"11111111")

       const comments=await Comment.find({blog:blogId}).populate("user","username").populate("blog","title");
       res.status(200).json({comment:comments})
    }catch(err){
       res.status(400).json({message:"Comment response failed",error:err})

    }

}
exports.getComment=async (req,res)=>{
     try{
    
       const comments=await Comment.find()
       res.status(200).json({comment:comments})
    }catch(err){
       res.status(400).json({message:"Comment response failed",error:err})

    }
}