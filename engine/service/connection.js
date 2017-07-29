const EventEmitter = require('events');
const uuid = require('uuid');

class Connection extends EventEmitter{
    constructor(type){
        super();
        this.type = type;
        this.id = uuid.v1();
    }
}

module.exports = Connection;
