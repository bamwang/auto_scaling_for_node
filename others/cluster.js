var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var i = 0;

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}


if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
    //console.log(cluster);
  }

// for(i in cluster.workers){
// 	cluster.workers[i].kill
// }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

} else {
  var express = require('express');
  var app = express();  // Workers can share any TCP connection
  // In this case its a HTTP server

  console.log(JSON.stringify(cluster.worker.workerID));
  var id = cluster.worker.workerID;
  app.get('/:n', function(req, res) {
    var number=fib(req.params.n);
    res.send(id + '<br/>' + number);
  });

  app.listen(process.env.PORT || 8080);
}
