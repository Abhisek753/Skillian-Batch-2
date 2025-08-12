const useController =require("../controllers/userController")

module.exports=(io,socket)=>{
//get user
    socket.on("getUsers",async ()=>{
        try{
          const users=await useController.getUsers()
          socket.emit("users",users);
        }catch(err){
          socket.emit("users",[]);
        }
    })

    //add user
   socket.on("addUser", async (userData)=>{
     try{
       const user=await useController.addUserSocket(userData);
       socket.emit("userAdded",user);
       const users=await useController.getUsers();
       io.emit("user",users);
     }catch(err){
       socket.emit("user not added added",{error:err.message})
     }

   })

}