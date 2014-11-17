var Caman = require('caman').Caman;

Caman("../input/bailing_gongzuo_jiaotan-001.jpg", function () {
  this.crop(200, 200 ,0 , 0);
  this.brightness(10);
  this.contrast(30);
  this.sepia(60);
  this.saturation(-30);
  this.render(function () {
    this.save("./output.png");
  });
});