var cluster = require('cluster');
var http = require('http');
var numCPUs = 50;//require('os').cpus().length;
var util = require('util');
var express = require('express');
var app = express();

function str(n) {
  var str='';
  var part = '0';
  for (var i = 0; i < n; i++) {
    str += part;
  };
  return n;
}



if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on('exit', function(worker, code, signal) {
    console.log("worker("+worker.id+").exit " + worker.process.pid);
  });
  cluster.on('online', function(worker) {
    console.log("worker("+worker.id+").online " + worker.process.pid);
  });
  cluster.on('listening', function(worker, address) {
    console.log("worker("+worker.id+").listening " + address.address + ":" + address.port);
  });
 
} else {
	app.get('/:n', function(req, res) {
	    var number=str(req.params.n);
	    res.send(''+number);
	});


	app.listen(4000);
}