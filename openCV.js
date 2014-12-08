var cv = require('openCV');
cv.readImage("./r.png", function(err, im){
  console.warn(err);
  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
	//console.warn(err,faces);
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      im.save('./out.jpg');
    }
  });
  	//im.canny(10, 300);
    //im.save('./out.jpg');
})