const express = require('express');
let {Server}=require('socket.io');
let http=require('http');
const app = express();

const cors = require('cors');

const server = http.createServer(app);
const port = 8000;
let io=new Server(server,{
  
  cors:{
    origin:'*',
    methods:['GET','POST'],
    credentials:true
  }
}

);

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})



io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('massage', (msg) => {
    io.emit('resmsg', msg); // Broadcast text messages to all clients
  });

  socket.on('media', (data) => {
    // Emit the media to all clients
    io.emit('resmedia', data);
  });
});



// serch one data route
server.listen(port, () => console.log(`Example app listening on port ${port}!`));



// require('dotenv').config();

// let mongoose = require('mongoose');
// const usr = require('./conn.js');
// let uploadt = require('./dmul.js')
// let uri = process.env.WOW_MONGO;
