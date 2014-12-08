var Canvas = require('canvas')
Image = Canvas.Image
var express = require('express');
var fs = require('fs');
var face_detect = require('face-detect')
// var Caman = require('caman').Caman;
var app = express();
var CryptoJS = require( 'crypto-js' );
var zlib = require('zlib');

var key = 'fasdf83njJIOjnkhoi3HFDIOu3hjfjIOOijioj3';
CryptoJS.enc.u8array = {
    /**
     * Converts a word array to a Uint8Array.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {Uint8Array} The Uint8Array.
     *
     * @static
     *
     * @example
     *
     *     var u8arr = CryptoJS.enc.u8array.stringify(wordArray);
     */
    stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var u8 = new Uint8Array(sigBytes);
        for (var i = 0; i < sigBytes; i++) {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            u8[i]=byte;
        }

        return u8;
    },

    /**
     * Converts a Uint8Array to a word array.
     *
     * @param {string} u8Str The Uint8Array.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.u8array.parse(u8arr);
     */
    parse: function (u8arr) {
        // Shortcut
        var len = u8arr.length;

        // Convert
        var words = [];
        for (var i = 0; i < len; i++) {
            words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
        }

        return CryptoJS.lib.WordArray.create(words, len);
    }
};
function process(req, res){
  res.write(' ');
  var startTime = new Date();
  var filename = req.path.replace('.jpg','');
  // console.warn(filename);
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.write(filename+'\t');
  var img = new Image();
  var logo = new Image();
  try{
    img.src = fs.readFileSync('./input'+filename + '.jpg' );
    logo.src = fs.readFileSync('./logo.png');
    var time = new Date() - startTime;
    //res.write('load:'+(time/1000)+'\t');
    
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
    var time = new Date() - startTime;
    //res.write('watermark:'+(time/1000)+'\t');

    var canvasForFaceDetetivision = new Canvas( img.width, img.height );
    var ctx4fd = canvasForFaceDetetivision.getContext('2d');
    ctx4fd.drawImage(img, 0, 0, img.width, img.height )
    var result = face_detect.detect_objects({ "canvas" : canvasForFaceDetetivision,
    "interval" : 5,
    "min_neighbors" : 1 });
    var time = new Date() - startTime;
    //res.write('recognition:'+(time/1000)+'\t');
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
      // //res.write('<img src="' + canvasForEachFace.toDataURL() + '" />');
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
    });
    var binary = canvas.toBuffer();
    var u8a = new Uint8Array( binary );
    // console.log(u8a)
    var srcWords = CryptoJS.enc.u8array.parse(u8a);
    var encrypted = CryptoJS.AES.encrypt( srcWords, key );
    var obj = {};
    obj.iv = encrypted.iv.toString();
    obj.s = encrypted.salt.toString();
    obj.ct = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    var src = JSON.stringify(obj);
    var time = new Date() - startTime;
    //res.write('encrypt:'+(time/1000)+'\t');
    canvas = null;
    ctx=null;
    canvasForEachFace = null;
    canvasForFaceDetetivision = null;
    ctx4ef = null;
    ctx4fd = null;
    /*
    var base64 = canvas.toDataURL();
    var encryptedData = cryptojs.Crypto.DES.encrypt( base64 , key );
    // //res.write('encrypt:'+ encryptedData +'\t');
    var time = new Date() - startTime;
    //res.write('encrypt:'+(time/1000)+'\t');
    */


    zlib.deflate(src, function(err, buffer) {
      // console.log(err)
      if (!err) {
        var time = new Date() - startTime;
        //res.write('compress:'+(time/1000)+'\t');

        fs.writeFileSync('./test.dat', buffer);
        var time = new Date() - startTime;
        //res.write('writeFileSync:'+(time/1000)+'\t');
        var time = new Date() - startTime;
        res.end(time/1000 + '\t');
      }
    });


    // fs.writeFileSync('./test.png', binary);
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
    // //res.write((time/1000)+'s');
    //   // });
    // });

    // //res.write('<img src="' + base64 + '" />');
    // var time = new Date() - startTime;
    // //res.write('toURL:'+(time/1000)+'s');

  }catch(e){
    res.end(e.toString());
  }
}

module.exports=process
