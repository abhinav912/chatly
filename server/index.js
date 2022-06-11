const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messagesRoute")
const app = express();
const socket = require("socket.io");
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 5000;
app.use(cors()); 
app.use(express.json());
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)

// ----------------- DEPLOYMENT ------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){

  app.use(express.static(path.join(__dirname1,'/public/build')));

  app.get('*',(req,res) => {
  
    res.sendFile(path.resolve(__dirname1,"public",'build','index.html'))
  });

} else {
  app.get("/",(req,res) => {
  res.send("API is running successfully")
});
 }



// --------------------------------------
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(PORT,() => {
 console.log(`Server Started on Port ${PORT}`);
});

const io=socket(server,{
  cors:{
    origin:"http://localhost:3000",
    credentials:true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});