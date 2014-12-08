var fs = require('fs');
var path = './';
var table = [];
// var list = fs.readdirSync(path);

var jsonStr = fs.readFileSync(path + 'result.txt');
var json = JSON.parse(jsonStr);
// console.warn(json);

var row = [''];
for(var i in json.byN){
	row.push(i);
}
table.push(row);

for(var lang in json.byLang ){
	var result = json.byLang[lang];
	var row = [lang];
	for (var j in result) {
		var n = result[j].real;
		row.push(n); 
	};
	table.push(row);
}
for (var i = 0; i < table.length; i++) {
	console.log(table[i].join('\t'));
};

