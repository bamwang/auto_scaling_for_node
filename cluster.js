var cluster = require('cluster');
var http = require('http');
var numCPUs = 100;//require('os').cpus().length;
var util = require('util');
var express = require('express');
var app = express();
var processM = require('./canvas/process')



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
	app.get('/:n', processM);
	app.listen(4000);
}
