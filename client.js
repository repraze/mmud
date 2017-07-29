const express = require('express');
const app = express();

const port = 80;

app.use(express.static(__dirname + '/client/public'));

app.listen(port, function(){
    console.log('MMUD app listening on port '+port);
});
