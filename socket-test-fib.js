var io = require('socket.io').listen(6501,{'log level': 1});
var util = require('util');
var cp = require('child_process');
// var express = require('express');
// var app = express();
var http = require('http');
// var numCPUs = require('os').cpus().length;
//http.createServer(3000);

// var addChild = false;

// var MIN_WORKER = parseInt(process.argv[2])>numCPUs ? process.argv[2] : numCPUs;
// var MAX_WORKER = parseInt(process.argv[3])>MIN_WORKER ? parseInt(process.argv[3]) : numCPUs;
// console.warn(process.argv[2], process.argv[3]);
// console.warn(MIN_WORKER ,MAX_WORKER);





function Task(req, res, id){
	var _req = req;
	var _res = res;
	var _id = id;
	this.getReq = function(){
		return _req;
	}
	this.getRes = function(){
		return _res;
	}
	this.getID = function(){
		return _id;
	}
	this.setReq = function(req){
		_req = req;
	}
	this.setRes = function(res){
		_res = res;
	}
	this.setID = function(id){
		_id = id;
	}
}

taskManager = new Array();
taskManager.st = new Array();
taskManager.add = function (task){
	this.push(task);
	this.st.push(new Date().getTime());
}
taskManager.get = function (){
	return this.shift();
}

function Cooperator(socket, maxWorker){
	var _id = socket.id;
	var _maxWorker = maxWorker;
	var _socket = socket;
	var _taskNum = 0;
	var _taskList = {};
	_socket.on('res',function(data){
		//console.log(data.id);
		var id = data.id;
		var res = _taskList[id].getRes();
		var html = data.html.toString();
		// res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin':'*'});
		res.end(html);
		_taskNum -- ;
		//console.log(_taskNum);
	})
	_socket.on('write',function(data){
		//console.log(data.id);
		var id = data.id;
		var res = _taskList[id].getRes();
		var html = data.content.toString();
		// res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin':'*'});
		res.write(html);
		//console.log(_taskNum);
	})
	this.getID = function(){
		return _id;
	}
	this.getMaxWorker = function(){
		return _maxWorker;
	}
	this.kill = function(){
		_socket.emit('kill');
	}
	this.sendTask = function( task ){
		_taskNum ++ ;
		//console.log(_taskNum);
		var id = task.getID();
		var req = task.getReq();
		_taskList[id] = task;
		_socket.emit('req', {
			id : id,
			req: req.url 
		});
	}
	this.isFull = function(){
		return _taskNum >= _maxWorker;
	}
}

function CooperatorManager(ioServer){

	var CooperatorList =function(){};
	var _list = {};
	var _idStack = [];
	var _maxWorker = 0;
	var _waiting = 0;
	var _desNum = 0;
	var _lastMaxWorker = 0;
	var _this = this;
	/*in this test we void it
	setInterval(function(){
		if( _waiting > 0 ) return;
		if( _maxWorker < _desNum){
			_this._generateCooperator();
		}
		else if( _maxWorker - _lastMaxWorker >= _desNum && _list.length > 1){
			_this._killLastCooperator();
		}
	*/
	},1000);

	//assign event callback
	/*================= 
	when my worker connects
	==================*/
	ioServer.sockets.on('connection', function (socket) {
	/*================= 
	when my worker ready
	==================*/
		socket.on('ready', function (data) {
			var maxWorker = data.maxWorker;
			console.log( "master get maxWorker: ",maxWorker );
			console.log("master  : cooperator " , socket.id ,"added.");
			var cooperator = new Cooperator(socket, maxWorker);
			_this._addCooperator(cooperator);
		});
		/*================= 
		when my worker leaves
		==================*/
		socket.on('disconnect', function () {
			var index = _idStack.indexOf(socket.id);
			//console.log(index);
			_idStack.splice(index, 1); 
			//console.log(_idStack);

			delete _list[socket.id];
		});
	});

	ioServer.sockets
	//private
	this._addCooperator = function(cooperator){
		//var id = cooperator.getID();
		var maxWorker = cooperator.getMaxWorker();
		var id = cooperator.getID();
		_maxWorker += maxWorker;
		_lastMaxWorker = maxWorker;
		_list[id] = cooperator;
		_idStack.push(id);
		_waiting -- ;
		//console.log(_idStack);
		//console.log(_list);
		// console.log(_maxWorker);
		// console.log(_lastMaxWorker);
		return _list;
	}
	this._killLastCooperator = function(){
		
		var id = _idStack.pop();
		var cooperator = _list[id];
		var maxWorker = cooperator.getMaxWorker();
		cooperator.kill();
		_maxWorker -= maxWorker;
		_lastMaxWorker = _list[_list.length-1].getMaxWorker();
	}
	this._generateCooperator = function(cb){
		var file = 'socket-test-cooperator-fib.js';
		var arg = ' 4 1000';
		var child = cp.fork(file ,[4,1000]);
		// var child = cp.exec('node '+ file + arg);
		// child.stdout.on('data', function (data) {
		//   console.log('C:' + data);
		// });
		// child.stderr.on('data', function (data) {
		//   console.log('C err:' + data);
		// });
		_waiting ++ ;
	}
	this._getTop = function(){
		return _list[0];
	}
	//public
	this.setDesNum = function(num){
		_desNum = num+1;
		//console.log('des : ',_desNum)
	}
	this.sendTask = function(task){
		//test
		for(var i = 0; i < _idStack.length; i ++){
			var cooperator = _list[_idStack[i]];
			if( !cooperator.isFull() ){	
				cooperator.sendTask(taskManager.shift());
				//console.warn(i);
				return true;
			}
		}
		//if cooperators are not enough, run the first one
		cm.setDesNum(taskManager.length);//set worker number
		_list[_idStack[0]].sendTask(taskManager.shift());
		return false;
	}
}

var cm = new CooperatorManager(io);

/*
test block
*/
cm.setDesNum(1);
function makeid(n)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < n+1 ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


http.createServer(function (req, res) {

	var task = new Task(req, res, makeid(10));
	taskManager.add(task);
	
}).listen(1337, '127.0.0.1');


setInterval(function(){
	//cm.setDesNum(taskManager.length);//set worker number
	var task = taskManager.length > 0 ? taskManager[0] : undefined;

	if(task){
		proc(taskManager);
	}

},0)


function proc(taskManager) {
	var req = taskManager[0].getReq();
	var res = taskManager[0].getRes();
	if(req.url=='/debug' || req.url=='/favicon.ico' ){
		res.writeHead(404);
		res.end();
	}else{
		cm.sendTask( taskManager );
	}	
}


