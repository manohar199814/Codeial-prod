module.exports.chatSockets = function(socketServer) {
    const io = require("socket.io")(socketServer,{ cors: { origin: '*' }});


    io.sockets.on("connection", (socket) => {
        console.log('new connection received ',socket.id);
        socket.on("disconnect", (reason) => {
           console.log('disconnected',reason);
        });

        socket.on('join_room',function(data){
            console.log('joining request rec.',data);
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data)
        });

        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })
    });

    
}