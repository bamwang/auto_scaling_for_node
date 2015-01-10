var cp = require('child_process');
var http = require('http');
http.createServer(function (req, res) {
	var startTime = new Date();
	// res.write(' - ' + startTime/1 + ' + ');
	var child = cp.fork('child');
	child.on('message',function(m){
		// console.log(m);
		res.write(m.time - startTime +'');
		res.end('\n');
		setTimeout(function(){
			child.kill('SIGHUP');
		},100)
	});
}).listen(1337, '127.0.0.1');
