var fs = require('fs');
var path = './results/';
var list = fs.readdirSync(path);
var dataByN = {};
var dataByLang = {};

// console.log(list);

for (var i = 0; i <= list.length - 1; i++) {
	var fileName = list[i];
	if(fileName.search('txt')==-1){
		continue;
	}
	// console.log(fileName);
	var contentsObj = fs.readFileSync(path+fileName);
	var contents = contentsObj.toString();
	var contentsArray = contents.split('\n');
	var n = fileName.split('-')[0];
	var lang = fileName.split('-')[1].split('.')[0];
	// console.log(contentsArray);
	for (var j in contentsArray){
		var timeLine = contentsArray[j];
		if(timeLine.search('\t0m')!== -1){
			var kv = timeLine.split('\t0m');
			var k = kv[0];
			var v = kv[1];
			putData(lang,n,k,v);
		}
	}
	// console.log(dataByLang);
	// console.log(dataByN);
};

var data = {
	byLang : dataByLang,
	byN : dataByN,
}
console.log(JSON.stringify(data,'\n','\t'));

function putData(lang,n,k,v){
	if(!dataByN[n])
		dataByN[n] = {};
	if(!dataByN[n][lang])
		dataByN[n][lang] = {};
	dataByN[n][lang][k] = v;	

	if(!dataByLang[lang])
		dataByLang[lang] = {};
	if(!dataByLang[lang][n])
		dataByLang[lang][n] = {};
	dataByLang[lang][n][k] = v;

}