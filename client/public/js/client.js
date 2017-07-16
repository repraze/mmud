class Client{
    constructor(settings){
        this.settings = Object.assign({
            origin  : window.location.origin,
            port    : 8888
        }, settings);
        this.socket = io(this.url);
        this.events = {};

        this.socket.on('text', function(str){
            this.fire('text', str);
        }.bind(this));

        this.socket.on('echo', function(str){
            this.fire('echo', str);
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

    fire(name, args){
        if(this.events[name]){
            this.events[name].forEach(function(cb){
                cb(args);
            });
        }
    }
}
