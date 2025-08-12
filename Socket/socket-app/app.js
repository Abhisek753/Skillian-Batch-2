require("dotenv").config();
const cors=require("cors");
const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const connectDB =require("./config/db");
const userSocketHandler=require("./socketHandlers/userSocket")
const PORT = process.env.PORT || 5001;
const app=express()
app.use(express.json());
app.use(cors());

app.get("/home",(req,res)=>{
    res.send("home page is running");
})
// creating http server
const server=http.createServer(app);

// creating socket.io server
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});

// register user socket handlers
io.on("connection",(socket)=>{
    console.log("Client connected");
    userSocketHandler(io,socket);
 socket.on("disconnect",()=>{
    console.log("client disconnected")
 })
})


connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server is running at ${PORT}`);
    });
}).catch(err=>{
    console.log(err)
})