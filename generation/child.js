var readyTime = new Date();
process.on('message',function (argument) {
	// body...
});
process.send({time:readyTime/1});