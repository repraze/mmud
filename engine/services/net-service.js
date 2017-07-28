const EventEmitter = require('events');
const net = require('net');

class NetService extends EventEmitter{
    constructor(){
        super();
        net.createServer(function(stream){
            let c = new EventEmitter();
            console.log('Net connection');
            this.emit('connection', c);
            let line = "";
            c.on('out', function(str, newline=true){
                if(newline === true){
                    str+='\n';
                }
                stream.write(str.replace(/\r?\n/g, "\r\n"));
            });
            stream.on('data', function(data){
                let str = data.toString();
                str.split(/(?=.)/u).forEach(function(char){
                    if(/[\n\r]$/.test(char)){
                        c.emit('in', line);
                        line = "";
                    }else{
                        line += char;
                    }
                });
            });
            stream.on('end', function(){
                c.emit('end');
                console.log('Net disconnection');
            });
        }.bind(this)).listen(23);
    }
}

module.exports = NetService;
