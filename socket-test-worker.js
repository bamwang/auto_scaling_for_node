var io = require('socket.io-client');
var cryptojs = require( 'cryptojs' );
console.log(process.argv);
var PORT = parseInt(process.argv[2])

var processFunc = require('./canvas/process')


function Res(socket, data){
  var _resBody = '';
  this.write = function(str){
    _resBody += str;
  }
  this.writeHead = function(str){

  }
  this.end = function(str){
    var str = str || '';
    _resBody += str;
    data.html = _resBody;
    socket.emit('res', data);
  }
}
function Req(data){
  this.path = data.req;
}


socket = io.connect('http://localhost:' + PORT, {reconnect: true});
  socket.emit('ready', { my: 'data' });
  socket.on('req', function (data) {
    //console.log('worker:',data)
    // var n = data.req;
    // processFunc(n, function(str){
    //   data.html = str.toString();
    //   socket.emit('res', data);
    //   // console.log(data);
    // }, data.req);
    req = new Req(data);
    res = new Res(socket, data);
    processFunc(req,res);
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });