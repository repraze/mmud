class Client{
    constructor(settings){
        this.settings = Object.assign({
            origin  : window.location.origin,
            port    : 8888
        }, settings);
        this.socket = io(this.url);
        this.events = {};

        this.socket.on('text', function(str){
            this.emit('text', str);
        }.bind(this));
    }

    get url(){
        return this.settings.origin+':'+this.settings.port;
    }

    on(name, cb){
        if(this.events[name]){
            this.events[name].push(cb);
        }else{
            this.events[name] = [cb];
        }
    }

    send(arg){
        if(arg){
            this.socket.emit('action', arg);
        }
    }

    emit(name, args){
        if(this.events[name]){
            this.events[name].forEach(function(cb){
                cb(args);
            });
        }
    }
}
