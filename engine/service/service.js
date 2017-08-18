const EventEmitter = require('events');

class Service extends EventEmitter{
    constructor(name, settings){
        super();
        this.name = name;
        this.settings = Object.assign({
            debug   : true
        }, settings);

        if(this.settings.debug){
            this.on('ready', () =>{
                console.log(this.name + ' ready');
            });
            this.on('connection', (c) =>{
                console.log(c.type+' connection '+c.id);
            });
            this.on('disconnection', (c) =>{
                console.log(c.type+' disconnection '+c.id);
            });
        }
    }
}

module.exports = Service;
