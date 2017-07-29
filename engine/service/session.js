class Session{
    constructor(){
        this.connections = [];
    }
    has(socket){
        return !!(this.socket.find((s)=>{return s.id === socket.id;}));
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
        this.sockets = this.sockets.filter(((s)=>{return s.id !== socket.id;}));
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

module.exports = {
    Session         : Session,
    SessionManager  : SessionManager
}
