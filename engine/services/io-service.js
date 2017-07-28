const EventEmitter = require('events');
const socket = require('socket.io');

class IoService extends EventEmitter{
    constructor(http){
        super();
        let io = socket(http);
        io.on('connection', function(socket){
            let c = new EventEmitter();
            console.log('Io connection id:'+socket.id);
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
    }
}

module.exports = IoService;
