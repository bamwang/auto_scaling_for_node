function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

module.exports = function(req, res) {
	var m = req.path.replace('/','');
	var n = parseInt(m);
	if( isNaN(n) )
		res.end();
	else{
		console.warn(n);
		var startTime = (new Date())/1000;
	    var number=fib(n);
	    var time = (new Date())/1000 - startTime;
	    res.end(''+time);
	}
}