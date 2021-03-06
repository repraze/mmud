const {Session, SessionManager} = require(__dirname+'/service/session');
const {Parser, Command} = require(__dirname+'/parser');

const IoService = require(__dirname+'/service/io-service');
const NetService = require(__dirname+'/service/net-service');

let mmud = function(){
    let manager = new SessionManager();
    let parser  = new Parser();

    parser.use(new Command('ping', 'ping [string:text+]', function(runtime){
        var text = runtime.args.text || "";
        runtime.session.emit('out', 'pong ' + text);
    }));

    parser.use(new Command('reverse', 'reverse [bool:invert] [string:text+]', function(runtime){
        var invert = runtime.args.invert;
        var text = runtime.args.text || "";
        if(invert){
            text = text.split('').reverse().join('');
        }
        runtime.session.emit('out', text);
    }));

    parser.use(new Command('repeat', 'repeat [int:number] [string:text+]', function(runtime){
        var number = runtime.args.number;
        var text = runtime.args.text || "";
        runtime.session.emit('out', text.repeat(number));
    }));

    let connect = function(client){
        console.log('Connection received');

        client.emit('out', '--- MMUD engine ---');

        client.on('in', function(action){
            if(action.length == 0){
                return;
            }
            parser.exec(action, {session : client}).then(function(res){
            }).catch(function(err){
                console.log(err);
                client.emit('out', 'Command not found');
            });
        });

        client.on('end', function(){
            console.log('Connection ended');
        });
    };

    new IoService().on('connection', connect);
    new NetService().on('connection', connect);
};


module.exports = mmud;
