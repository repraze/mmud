const http  = require('http').Server();
const mmud  = require(__dirname+'/engine/mmud');

http.listen(8888, function(){
    console.log('Server Up');
    mmud(http);
});
