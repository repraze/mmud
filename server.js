const mmud  = require(__dirname+'/engine/mmud');

mmud({
    services : [
        {
            io : {
                port : 8888
            }
        },
        {
            net : {
                port : 23
            }
        },
    ]
});
