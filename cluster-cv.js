var cluster = require('cluster');
var http = require('http');
var numCPUs = 100;//require('os').cpus().length;
var util = require('util');
var express = require('express');
var app = express();

function cv(n, cb, data) {
  var cv = require('openCV');
  cv.readImage("./r.png", function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    // console.log(err,faces);
      for (var i=0;i<faces.length; i++){
        var x = faces[i]
        //im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      }
      return cb(JSON.stringify(faces));
    });
    // console.warn(err);
    // im.canny(5, 500);
    // im.save("./output.jpg");
  })
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
	    // var number=fib(req.params.n);
    cv(req.params.n, function(str){
      data = str.toString();
      res.send(''+data);
    });

	});


	app.listen(4000);
}
