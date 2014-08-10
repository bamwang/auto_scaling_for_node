var io = require('socket.io-client');
var PORT = parseInt(process.argv[2])
//console.log(PORT);

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

// socket = io.connect('http://localhost:' + PORT, {reconnect: true});
//   socket.emit('ready', { my: 'data' });
//   socket.on('req', function (data) {
//     //console.log('worker:',data)
//     var n = data.req.substr(1);

process.on('message', function(message) {
  if(message.type == 'req'){
    var n = message.data.req.substr(1);
    //var n = message.data.req.substr(1); //todo
    if(isNaN(n)) n = 1;
    var result = fib(n);
    //console.log(result);
  //   data.html = result.toString();
  //   socket.emit('res', data);
  // });
  // socket.on('kill', function (data) {
  //   console.log("exited");
  //   process.exit(0);
  // });

    message.data.html = result.toString();
    message.type = 'res';
    // console.log(message);
    process.send(message);
  }
  else if(message.type == 'kill'){
    console.log("killed by message");
    process.exit(0);
  }
});
process.send({ type: 'ready' });


// socket = io.connect('http://localhost:' + PORT, {reconnect: true});
//   socket.emit('ready', { my: 'data' });
//   socket.on('req', function (data) {
//     //console.log('worker:',data)
//     var n = data.req.substr(1);
//     if(isNaN(n)) n = 1;
//     var result = fib(n);
//     //console.log(result);
//     data.html = result.toString();
//     socket.emit('res', data);
//   });
//   socket.on('kill', function (data) {
//   	console.log("exited");
//   	process.exit(0);
//   });