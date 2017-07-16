const {Session, SessionManager} = require(__dirname+'/session.js');
const {Parser, Command} = require(__dirname+'/parser.js');

let mmud = function(io){
    let manager = new SessionManager();
    let parser  = new Parser();

    parser.use(new Command('ping', 'ping [something+]', function(runtime){
        var str = runtime.args.something || "";
        runtime.session.emit('text', "pong "+str.split('').reverse().join(''));
    }));

    io.on('connection', function(socket){
        console.log('Connection id:'+socket.id);

        socket.on('action', function(action){
            parser.exec(action, {session : socket}).then(function(res){

            }).catch(function(err){
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
