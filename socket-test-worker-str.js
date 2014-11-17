var io = require('socket.io-client');
var PORT = parseInt(process.argv[2])
//console.log(PORT);

function str(n) {
  var str='';
  var part = '0';
  for (var i = 0; i < n; i++) {
    str += part;
  };
  return n;
}

socket = io.connect('http://localhost:' + PORT, {reconnect: true});
  socket.emit('ready', { my: 'data' });
  socket.on('req', function (data) {
    //console.log('worker:',data)
    var n = data.req.substr(1);
    if(isNaN(n)) n = 1;
    var result = str(n);
    //console.log(result);
    data.html = result.toString();
    socket.emit('res', data);
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });