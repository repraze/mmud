const Service = require(__dirname+'/service');
const Connection = require(__dirname+'/connection');

const net = require('net');

class NetService extends Service{
    constructor(settings){
        super("NetService", settings);
        Object.assign(this.settings, {
            port    : 23
        }, settings);

        net.createServer(function(socket){
            let c = new Connection("net");
            let line = "";
            c.on('out', function(str, newline=true){
                if(newline === true){
                    str+='\n';
                }
                socket.write(str.replace(/\r?\n/g, "\r\n"));
            });
            socket.on('data', function(data){
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
            socket.on('end', function(){
                c.emit('end');
                this.emit('disconnection', c);
            }.bind(this));
            this.emit('connection', c);
        }.bind(this)).listen(this.settings.port, function(){
            this.emit('ready');
        }.bind(this));
    }
}

module.exports = NetService;
