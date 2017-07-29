const Service = require(__dirname+'/service');
const Connection = require(__dirname+'/connection');

const http  = require('http').Server();
const socket = require('socket.io');

class IoService extends Service{
    constructor(settings){
        super("IoService", settings);
        Object.assign(this.settings, {
            port    : 8888
        }, settings);

        console.log(this.settings);

        http.listen(this.settings.port, function(){
            let io = socket(http);
            io.on('connection', function(socket){
                let c = new Connection("io");
                this.emit('connection', c);
                c.on('out', function(str, newline=true){
                    if(newline === true){
                        str+='\n';
                    }
                    socket.emit('text', str);
                });
                socket.on('action', function(line){
                    c.emit('in', line);
                });
                socket.on('disconnect', function(){
                    c.emit('end');
                    console.log('Io disconnection id:'+socket.id);
                });
            }.bind(this));

            this.emit('ready');
        }.bind(this));
    }
}

module.exports = IoService;
