const useController =require("../controllers/userController")

module.exports=(io,socket)=>{
//get user
    socket.on("getUsers",async ()=>{
        try{
          const users=await useController.getUsers()
          socket.emit("user",users);
        }catch(err){
          socket.emit("user",[]);
        }
    })

    //add user
   socket.on("addUser", async (userData)=>{
     try{
       const user=await useController.addUserSocket(userData);
       console.log(user,"user created");
       socket.emit("userAdded",user);
       const users=await useController.getUsers();
       io.emit("user",users);
     }catch(err){
       socket.emit("userNotAdded",{error:err.message}); 
     }

   })
   socket.on("editUser", async (userData)=>{
    //  try{
    //    const user=await useController.addUserSocket(userData);
    //    console.log(user,"user created");
    //    socket.emit("userAdded",user);
    //    const users=await useController.getUsers();
    //    io.emit("user",users);
    //  }catch(err){
    //    socket.emit("userNotAdded",{error:err.message}); 
    //  }

   })
}