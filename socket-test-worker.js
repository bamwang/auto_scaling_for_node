var io = require('socket.io-client');

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}


socket = io.connect('http://localhost:6501', {reconnect: true});
  socket.on('who', function (data) {
    console.log('worker:', data);
    socket.emit('worker', { my: 'data' });
  });
  socket.on('req', function (data) {
    //console.log('worker:',data)
    var n = data.req.substr(1);
    if(isNaN(n)) n = 1;
    var result = fib(n);
    //console.log(result);
    socket.emit('res', { my: result });
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });