var io = require('socket.io-client');
var cp = require('child_process');
var WORKER_FILE_NAME = 'socket-test-worker.js';
var localCP = 0;
socket = io.connect('http://localhost:6501', {reconnect: true});
  socket.on('who', function (data) {
    console.log('cooperator:', data);
    socket.emit('who', { type: 'cooperator' });
  });
  socket.on('generateWorker', function () {
    var child = cp.fork(WORKER_FILE_NAME,function(){localCP++});
    child.on('exit',function(){
      console.log('exit a child');
      localCP -- ;
    });
  });
  socket.on('kill', function (data) {
  	console.log("exited");
  	process.exit(0);
  });