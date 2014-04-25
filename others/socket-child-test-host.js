var io = require('socket.io').listen(6501,{'log level': 1});
var util = require('util');

var cp = require('child_process');


var child=cp.fork(__dirname + '/socket-test-2.js');
 


io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	console.log(child.pid);
	child.kill('SIGSTOP');

	setTimeout(function(){
		child.kill('SIGCONT');
	},2000);
	//child.kill('SIGCONT');
	socket.emit('news', { hello: 'world' });
	socket.on('disconnect', function () {
		console.warn(socket.id+"is disconnected");
		//console.log(child);
	});

});



