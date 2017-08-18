const Connection = require(__dirname+'/connection');

class Session{
    constructor(){
        this.connections = [];
        this.buffer = [];
    }
    has(connection){
        return !!(this.connections.find((c)=>{return c.id === connection.id;}));
    }
    empty(){
        return this.connections.length === 0;
    }
    add(connection){
        if(Array.isArray(connection)){
            connection.forEach((c)=>{this.add(c)})
        }else{
            if(!this.has(connection)){
                connection.on('in')
                this.connections.push(connection);
            }
        }
    }
    remove(connection){
        if(Array.isArray(connection)){
            connection.forEach((c)=>{this.remove(c)})
        }else{
            this.connections = this.connections.filter(
                (connection instanceof Connection) ?
                (c)=>{return c.id !== connection.id;} :
                (c)=>{return c.id !== connection;}
            );
        }
    }
    on(){
        this.connections.forEach((c)=>{c.on(...args)});
    }
    once(){
        this.connections.forEach((c)=>{c.once(...args)});
    }
    emit(...args){
        this.connections.forEach((c)=>{c.emit(...args)});
    }
    in(cb){

    }
    out(text){
        this.emit('out', text);
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
