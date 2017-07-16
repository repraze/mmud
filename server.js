const http  = require('http').Server();
const io    = require('socket.io')(http);
const mmud  = require(__dirname+'/engine/mmud.js');

http.listen(8888, function(){
    console.log('Server Up');
    mmud(io);
});
