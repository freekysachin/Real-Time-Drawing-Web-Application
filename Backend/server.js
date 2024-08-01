const { Socket } = require('dgram')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server =  http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods: ['GET', 'POST'],
    }
})

io.on('connection',(socket)=>{
    console.log("user connected");

    socket.on('drawing',(data)=>{
        socket.broadcast.emit('drawing',data)
    })

    socket.on('clearCanvas',()=>{
        socket.broadcast.emit('clearCanvas')
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});