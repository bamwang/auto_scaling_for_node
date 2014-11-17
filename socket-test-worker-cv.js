var io = require('socket.io-client');
var PORT = parseInt(process.argv[2])
//console.log(PORT);

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



socket = io.connect('http://localhost:' + PORT, {reconnect: true});
  socket.emit('ready', { my: 'data' });
  socket.on('req', function (data) {
    //console.log('worker:',data)
    var n = data.req.substr(1);
    if(isNaN(n)) n = 1;
    cv(n, function(str){
      data.html = str.toString();
      socket.emit('res', data);
      // console.log(data);
    }, data.req);
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });