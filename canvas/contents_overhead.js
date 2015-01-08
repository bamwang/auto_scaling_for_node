var fs = require('fs');

function main (req,res) {
  var m = parseInt(req.path.substr(1));
  console.log(req);
  var buffer = fs.readFileSync('./random.txt')
  var text = buffer.toString('ascii');
  var output = text.substr(0, 1024*1024*m);
  var startTime = new Date();
  res.writeH(output);
  var time = new Date() - startTime;
  res.end('\n'+time);
}
module.exports=main
