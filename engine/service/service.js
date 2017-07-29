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
                console.log('New '+c.type+' connection '+c.id);
            });
            this.on('ready', () =>{
                console.log(this.name + ' ready');
            });
        }
    }
}

module.exports = Service;
