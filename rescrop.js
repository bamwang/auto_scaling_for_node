  var easyimg = require('easyimage');

var FileName ="bailing_gongzuo_jiaotan-002.jpg"
easyimg.rescrop({
    src:"output/" + FileName, dst:'output/kitten-case_.jpg',
    width:800, 
    cropwidth:60, cropheight:60,
    x:122,y:122,
    gravity:'northWest'
    // cropwidth:face.width, cropheight:face.height,
    // x:face.x + face.width/2, y:face.y + face.height/2
  }).then(
  function(image) {
    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
  },
  function (err) {
    console.log(err);
  }
);