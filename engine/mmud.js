module.exports = function(io){
    io.on('connection', function(socket){
        console.log('a user connected');

        setInterval(function(){
            socket.emit('text', "hello"+Math.random());
        },500)
        socket.on('disconnect', function(){
            console.log('user disconnected');

            //io.to(socket.id).emit('text', "hello");
        });
    });
};
