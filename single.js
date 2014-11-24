var express = require('express');
var app = express();
var processM = require('./canvas/process')



app.get('/:n', processM);


app.listen(3000);