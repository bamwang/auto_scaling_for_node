// var fs = require('fs');
function makeStr(n){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < n+1 ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function main (req,res) {
	var reqArray = req.path.split('/');
	var m = parseInt(reqArray[2]);
	var randStr = makeStr(102400);
	if(reqArray[1]=='L'){
		var startTime = new Date();
		res.write('0 - ' + startTime/1 + ' + ');
		for (var i = 0; i < m*100; i++) {
			// res.writeH(randStr);
			res.writeH('.');
		};
		// var time = new Date() - startTime;
	}else if(reqArray[1]=='T'){
		var startTime = new Date();
		res.write('0 - ' + startTime/1 + ' + ');
		for (var i = 0; i < m; i++) {
			// res.writeH(randStr);
			res.writeH(randStr);
		};
		// var time = new Date() - startTime;
	}else{
		// console.log(reqArray[1])
		var output = '';
		for (var i = 0; i < m; i++) {
			// res.writeH(randStr);
			output += randStr;
		};
		var startTime = new Date();
		res.write('0 - ' + startTime/1 + ' + ');
		res.writeH(output);
		// var time = new Date() - startTime;
	}
	res.end();
}
module.exports=main
