var io = require('socket.io-client');
var cryptojs = require( 'cryptojs' );
console.log(process.argv);
var PORT = parseInt(process.argv[2])

var processFunc = require('./canvas/contents_overhead')


function Res(message, data){
  // var _resBody = '';
  this.write = function(str){
    message.data.content = str;
    message.type = 'write';
    process.send(message);
  }
  this.writeH = function(str){
    message.data.content = str;
    message.type = 'writeH';
    process.send(message);
  }
  this.writeHead = function(str){

  }
  this.end = function(str){
    var str = str || '';
    message.data.html = str;
    message.type = 'res';
    process.send(message);
    console.log('called end');
  }
}
function Req(data){
  this.path = data.req;
}


process.on('message', function(message) {
  if(message.type == 'req'){
    req = new Req(message.data);
    res = new Res(message);
    processFunc(req,res);
  }
  else if(message.type == 'kill'){
    console.log("killed by message");
    process.exit(0);
  }
});
process.send({ type: 'ready' });
