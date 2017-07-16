
class Session{
    constructor(){
        this.sockets = [];
    }
    has(socket){
        return !!(this.socket.find((s)=>{return s.id === socket.id}));
    }
    empty(){
        return this.sockets.length === 0;
    }
    add(socket){
        if(!this.has(socket)){
            this.sockets.push(socket);
        }
    }
    remove(socket){
        this.sockets = this.sockets.filter(((s)=>{return s.id !== socket.id});
    }
    emit(...args){
        this.sockets.forEach((s)=>{s.emit(...args)});
    }
}

class SessionManager{
    constructor(){
        this.sessions = {};
    }

    get(id){
        if(!this.sessions[id]){
            this.sessions[id] = new Session();
        }
        return this.sessions[id]
    }
}

let mmud = function(io){
    let manager = new SessionManager();

    io.on('connection', function(socket){
        console.log('Connection id:'+socket.id);

        socket.on('action', function(str){
            socket.emit('text', str.split('').reverse().join(''));
        });

        socket.on('disconnect', function(){
            console.log('Disconnection id:'+socket.id);

            //io.to(socket.id).emit('text', "hello");
        });
    });
};


module.exports = mmud;
