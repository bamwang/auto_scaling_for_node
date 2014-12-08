var cluster = require('cluster');
var http = require('http');
var numCPUs = 100;//require('os').cpus().length;
var util = require('util');
var express = require('express');
var app = express();

function cv(FileName, cb, data) {
  console.log(FileName);
  var cv = require('openCV');
  var easyimg = require('easyimage');
  var Caman = require('caman').Caman;

  cv.readImage("input/" + FileName, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
      var imgWidth = im.width();
      console.log(err,faces);
      Caman("input/" + FileName, function () {
        this.resize({
          width: 600
        });
        // this.crop(face.width*rate, face.height*rate ,face.x*rate , face.y*rate);
        this.brightness(15)
        this.exposure(15)
        this.curves('rgb', [0, 0], [200, 0], [155, 255], [255, 255])
        this.saturation(-50)
        this.gamma(1.8)
        this.vignette("50%", 60)
        this.brightness(5)
        this.contrast(30);
        this.sepia(60);
        this.render(function () {
          // this.save('output/'+ FileName );
          for (var i=0;i<faces.length; i++){
            var face = faces[i]
            var rate = 64/face.width;
            im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
            Caman("input/" + FileName, function () {
              this.resize({
                width: imgWidth*rate
              });
              this.crop(face.width*rate, face.height*rate ,face.x*rate , face.y*rate);
              this.brightness(15)
              this.exposure(15)
              this.curves('rgb', [0, 0], [200, 0], [155, 255], [255, 255])
              this.saturation(-50)
              this.gamma(1.8)
              this.vignette("50%", 60)
              this.brightness(5)
              this.contrast(30);
              this.sepia(60);
              this.render(function () {
                // this.save('output/crop/'+ FileName + '_' + i + '.jpg');
              });
            });
          }
          cb(JSON.stringify(faces));//
        });
      });
    });
  });
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
      res.header('Access-Control-Allow-Origin','*');
      res.write(''+data);
      res.end();
    });

	});


	app.listen(4000);
}
