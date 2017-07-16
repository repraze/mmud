const {Session, SessionManager} = require(__dirname+'/session.js');
const {Parser, Command} = require(__dirname+'/parser.js');

let mmud = function(io){
    let manager = new SessionManager();
    let parser  = new Parser();

    parser.use(new Command('ping', 'ping [string:text+]', function(runtime){
        var text = runtime.args.text || "";
        runtime.session.emit('text', 'pong ' + text);
    }));

    parser.use(new Command('reverse', 'reverse [bool:invert] [string:text+]', function(runtime){
        var invert = runtime.args.invert;
        var text = runtime.args.text || "";
        if(invert){
            text = text.split('').reverse().join('');
        }
        runtime.session.emit('text', text);
    }));

    parser.use(new Command('repeat', 'repeat [int:number] [string:text+]', function(runtime){
        var number = runtime.args.number;
        var text = runtime.args.text || "";
        runtime.session.emit('text', text.repeat(number));
    }));

    io.on('connection', function(socket){
        console.log('Connection id:'+socket.id);

        socket.on('action', function(action){
            socket.emit('echo', '> '+action);
            parser.exec(action, {session : socket}).then(function(res){

            }).catch(function(err){
                console.log(err);
                socket.emit('text', 'Command not found');
            });
        });

        socket.on('disconnect', function(){
            console.log('Disconnection id:'+socket.id);

            //io.to(socket.id).emit('text', "hello");
        });
    });
};


module.exports = mmud;
