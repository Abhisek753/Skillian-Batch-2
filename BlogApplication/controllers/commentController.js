const Comment =require("../models/Comment");
const Blog=require("../models/Blogs");

exports.createComment=async (req,res)=>{
    try{
   const  {text,blog}=req.body;
   const blogData=await Blog.findById(blog);
   console.log(blogData,"11111111")
   if(!blogData){
    return res.status(404).json({message:"Blog not found"});
   }

   const comment =new Comment({
    text,
    user:req.user.id,
    blog:blogData._id
   });
   await comment.save();
   console.log(blogData,"blog data",comment)
   blogData.comments.push(comment._id);
   await blogData.save();
  
   await comment.populate("user","username role")
   res.status(201).json({message:"comment created successfully",comment})

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

exports.updateComment=async(req,res)=>{
   try{
    const {commentId}=req.params;
    const {text}=req.body;
    console.log(text,"123");
    const updated=await Comment.findByIdAndUpdate(
      commentId,{text}
    ).populate("user","username role")
    console.log(updated,"updated comment");
    if(!updated){
      return res.status(404).json({message:"comment not found"})
    }
    res.status(200).json({message:"Comment Updated successfully",comment:updated})



   }catch(err){
  return res.status(404).json({message:"Updatation failed",error:err})
   }
}