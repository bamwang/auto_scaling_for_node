var easyimg = require('easyimage');
var list =["IMG_5670.JPG","IMG_5671.JPG","IMG_5672.JPG","IMG_5673.JPG","IMG_5675.JPG","IMG_5679.JPG","IMG_5682.JPG","IMG_5683.JPG","IMG_5684.JPG","IMG_5688.JPG","IMG_5691.JPG","IMG_5692.JPG","IMG_5693.JPG","IMG_5696.JPG","IMG_5697.JPG","IMG_5698.JPG","IMG_5701.JPG","IMG_5706.JPG","IMG_5707.JPG","IMG_5708.JPG","IMG_5709.JPG","IMG_5712.JPG","IMG_5714.JPG","IMG_5716.JPG"];

for (var i=0;i<list.length;i++){
  easyimg.resize({
    src:"img/" + list[i],
    dst:"out/" + list[i],
    width:800
  }, function(err, image) {
    if (err) throw err;
    console.log('Resized ' + image.width + ' x ' + image.height);
  });
}