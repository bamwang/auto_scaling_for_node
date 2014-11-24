var Canvas = require('canvas')
Image = Canvas.Image
var express = require('express');
var fs = require('fs');
var face_detect = require('face-detect')
var Caman = require('caman').Caman;
var app = express();
var cryptojs = require( 'cryptojs' );

var key = 'fasdf83njJIOjnkhoi3HFDIOu3hjfjIOOijioj3';

function process(req, res){
  var startTime = new Date();
  var filename = req.path.replace('.jpg','');
  console.warn(filename);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var img = new Image();
  var logo = new Image();
  try{
    img.src = fs.readFileSync('./input'+filename + '.jpg' );
    logo.src = fs.readFileSync('./logo.png');
    var imgRatio = img.height / img.width;
    var imgDrawWidth = 600;
    var imgDrawHeight = Math.round(imgDrawWidth * imgRatio);

    var logoRatio = logo.height / logo.width;
    var logoDrawWidth = 0.4 * imgDrawWidth;
    var logoDrawHeight = logoDrawWidth * logoRatio;
    var rad = Math.PI/4;
    console.log(imgDrawWidth,imgDrawHeight);

    var canvas = new Canvas(imgDrawWidth,imgDrawHeight);
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, imgDrawWidth, imgDrawHeight);
    ctx.save();
    ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), imgDrawWidth/2, imgDrawHeight/2);
    ctx.translate( -1 * imgDrawWidth/2, -1 * imgDrawHeight/2 ); 



    ctx.globalAlpha = 0.5;
    ctx.drawImage(logo, (imgDrawWidth-logoDrawWidth)/2, (imgDrawHeight-logoDrawHeight)/2, logoDrawWidth, logoRatio * logo.width);
    ctx.restore();
    ctx.save();

    var canvasForFaceDetetivision = new Canvas( img.width, img.height );
    var ctx4fd = canvasForFaceDetetivision.getContext('2d');
    ctx4fd.drawImage(img, 0, 0, img.width, img.height )
    var result = face_detect.detect_objects({ "canvas" : canvasForFaceDetetivision,
    "interval" : 5,
    "min_neighbors" : 1 });
    console.log('Found ' + result.length  + ' faces.');
    result.map(function(face, index){
      var adjustRate = 2;
      var resizeRate = 128 / face.width / (1 + adjustRate)  
      console.log(resizeRate)
      var canvasForEachFace = new Canvas(128 , 128);
      var ctx4ef = canvasForEachFace.getContext('2d');
      // ctx.strokeRect(face.x-face.width*adjustRate/2, face.y-face.height*adjustRate/2, face.width * ( 1 + adjustRate ),face.height * ( 1 + adjustRate ));
      ctx4ef.drawImage(img, (-face.x+face.width*adjustRate/2)*resizeRate, (-face.y+face.height*adjustRate/2)*resizeRate, img.width*resizeRate, img.height*resizeRate );
      console.log(face);
      // res.write('<img src="' + canvasForEachFace.toDataURL() + '" />');
      // Caman(canvasForEachFace.toBuffer(), function () {
      //   // this.crop(200, 200 ,0 , 0);
      //   // this.brightness(10);
      //   // this.contrast(30);
      //   // this.sepia(60);
      //   // this.saturation(-30);
      //   // this.render(function (d) {
      //     // console.log(d)
          // this.save("./output/face"+filename+'_'+ index+ ".png");
      //   // });
      // });
    })
    var time = new Date() - startTime;
    res.write('recognition:'+(time/1000)+'s<br>');
    var base64 = canvas.toDataURL();
    var encryptedData = cryptojs.Crypto.AES.encrypt( base64, key );
    // res.write('encrypt:'+ encryptedData +'<br>');
    var time = new Date() - startTime;
    res.write('encrypt:'+(time/1000)+'s<br>');

    // Caman(canvas.toBuffer(), function () {
    //   // this.crop(200, 200 ,0 , 0);
    //   // this.brightness(10);
    //   // this.contrast(30);
    //   // this.sepia(60);
    //   // this.saturation(-30);
    //   // this.render(function (d) {
    //     // console.log(d)
    //     this.save("./output"+filename+".png");
    //         var time = new Date() - startTime;
    // res.write((time/1000)+'s');
    //   // });
    // });

    // res.write('<img src="' + base64 + '" />');
    var time = new Date() - startTime;
    res.write('toURL:'+(time/1000)+'s');
    res.end();

  }catch(e){
    res.end(e.toString());
  }
}

module.exports=process