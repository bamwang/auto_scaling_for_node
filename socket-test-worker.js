var io = require('socket.io-client');

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

socket = io.connect('http://localhost:6600', {reconnect: true});
  socket.emit('ready', { my: 'data' });
  socket.on('req', function (data) {
    //console.log('worker:',data)
    var n = data.req.substr(1);
    if(isNaN(n)) n = 1;
    var result = fib(n);
    //console.log(result);
    data.html = result.toString();
    socket.emit('res', data);
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });