const express = require('express');
const socket = require('socket.io');
const path = require('path');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

const app = express();
const server = app.listen(port,()=>{
    console.log("Started Server");
})

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.sendFile('login.html', { root: path.join(__dirname, '/public') });
})

app.get('/chat',(req,res)=>{
    res.sendFile('chat.html', { root: path.join(__dirname, '/public') });
})

const io = socket(server);
let users_array = {};

io.on('connection',(socket)=>{
    
    users_array[socket.id] = socket.handshake.query.username;
    console.log(users_array)
    io.sockets.emit('add-user',users_array);

    socket.on('chat',(data)=>{
        data = {...data,username:users_array[data.socket_id]};

        socket.emit('right-chat',data);
        if(data.send_to.length > 0){
            for(key in users_array){
                if(data.send_to.indexOf(users_array[key]) !== -1){
                    io.to(key).emit('left-chat',data);
                }
            }
        }
        else{
            socket.broadcast.emit('left-chat',data);
        }
    })

    socket.on('disconnect',()=>{
        delete users_array[socket.id]
        socket.broadcast.emit('add-user',users_array);
    })
})