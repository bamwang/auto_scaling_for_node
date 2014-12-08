var express = require('express');
var app = express();
var fib = require('./fib');

app.get('/:n', fib);

app.listen(3001);
