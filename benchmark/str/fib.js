var n = process.argv[2]? parseInt(process.argv[2]) : 1; 
function str(n) {
	var str = "";
	var toBeAppended = "0";
	for (var i = 0; i < n; i++) {
		str += toBeAppended;
	};
	return n;
}
console.log(str(n));