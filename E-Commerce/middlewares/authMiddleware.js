
const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET;

const authMiddleWare=(req,res,next)=>{
  const authHeader=req.headers["authorization"];
  const token=authHeader && authHeader.split(" ")[1];
  if(!token){
    return res.status(404).json({
        message:"No tokens found"
    });
  }
  try{
    const decode=jwt.verify(token,JWT_SECRET);
    req.user=decode;
    next();
  }catch(err){
    return res.status(401).json({
        message:"Invlid Token"
    })
  }

}
module.exports=authMiddleWare;
