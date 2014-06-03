var io = require('socket.io').listen(6501,{'log level': 1});
var util = require('util');
// var express = require('express');
// var app = express();
var http = require('http');
var numCPUs = require('os').cpus().length;
//http.createServer(3000);

var addChild = false;

var MIN_WORKER = parseInt(process.argv[2])>numCPUs ? process.argv[2] : numCPUs;
var MAX_WORKER = parseInt(process.argv[3])>MIN_WORKER ? parseInt(process.argv[3]) : numCPUs;
console.warn(process.argv[2], process.argv[3]);
console.warn(MIN_WORKER ,MAX_WORKER);

var WORKER_FILE_NAME = 'socket-test-worker.js';

var cp = require('child_process');

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
	//this.st.push(new Date().getTime());
}
taskManager.get = function (){
	return this.shift();
}


function Worker(socket, id){
	var _id = socket.id||id;
	var _inUse = false;
	var _socket = socket;
	this.setSocket = function(socket){
		if(typeof socket !== 'object'){
			console.error(typeof socket);
			return -1;
		}			
		_socket = socket;
		return 0;
	}
	this.setInUse = function(status){
		if(status!==true && status !== false)
			return -1
		_inUse = status;
		return status;
	}
	this.getSocket = function(){
		return _socket;
	}
	this.getInUse = function(){
		return _inUse;
	}
	this.getID = function(){
		return _id;
	}
	this.kill = function(){
		_socket.emit("kill");
	}
}

function WorkerDispatcher(id){
	var _localCP = 0;
	var IdleList =function(){};
	var BusyList =function(){};
	var _idle = new IdleList();
	var _busy = new BusyList();
	var cm = new CooperatorManager();
	//private
	this.checkArg = function(){}
	var _addWorkerTo = function(worker, list){

		//todo: move to checkArg
		if(!worker.constructor || !worker.constructor.name==='Worker'){
			console.error("Tried to add a "+worker.constructor.name);
			return {
				err : "worker",
				type : worker.constructor.name
			}
		}
		if(list!==_idle && list!==_busy){
			console.error("Tried to add a "+worker.constructor.name);
			return {
				err : "list",
				type : list.constructor.name
			}
		}
		
		var id = worker.getID();
		list[id] = worker;
		return [_idle,_busy];
	}
	var _removeWorkerFrom = function(worker, list){
		//todo: move to checkArg
		if(!worker.constructor || !worker.constructor.name==='Worker'){
			console.error("Tried to add a "+worker.constructor.name);
			return {
				err : "worker",
				type : worker.constructor.name
			}
		}
		if(list!==_idle && list!==_busy){
			console.error("Tried to add a "+worker.constructor.name);
			return {
				err : "list",
				type : list.constructor.name
			}
		}
		//
		var id = worker.getID();
		delete list[id];
		return [_idle,_busy];
	}
	var _removeWorkerFromById = function(workerId, list){
		var id = workerId;
		delete list[id];
		return [_idle,_busy];
	}
	var _getWorkerFrom = function(id, list){
		if(list[id])
			return list[id];
		else return -1;
	}
	this.getIdleWorker = function(){
		var ids=Object.keys(_idle);
		if(ids.length>0){
			var id = ids[0];
			var worker = _getWorkerFrom(id, _idle);
			_removeWorkerFrom(worker, _idle);
			_addWorkerTo(worker, _busy);
			return worker;
		}
		return undefined;
	}
	this.returnIdleWorker = function(worker){
		//todo: add validation of worker
		_removeWorkerFrom(worker, _busy);
		_addWorkerTo(worker, _idle);
		return [_idle,_busy];
	}
	this.addNewWorker = function(worker){
		//todo: add validation of worker
		return _addWorkerTo(worker, _idle);
	}
	this.removeDeadWorker = function(worker){
		//todo: add validation of worker
		if(typeof worker === "string"){
			_removeWorkerFromById(worker, _idle);
			_removeWorkerFromById(worker, _busy);
		}else{
			_removeWorkerFrom(worker, _idle);
			_removeWorkerFrom(worker, _busy);
		}
	}
	this.getList = function(){
		return [_idle,_busy];
	}
	this.getAliveWorker = function(){
		var idInIdle=Object.keys(_idle);
		var idInBusy=Object.keys(_busy);
		return idInBusy.length+idInIdle.length;
	}
	this.killIdleWorker = function(){
		if(_localCP <= MIN_WORKER) return;
		var ids=Object.keys(_idle);
		if(ids.length>0){
			console.log("idel: ", ids.length);
			var id = ids[0];
			var worker = _getWorkerFrom(id, _idle);
			worker.kill();
			this.removeDeadWorker(worker);
			_localCP--;
			return [_idle,_busy];
		}
	}
	/*
	从后追加的cooperator中删除
	*/
	this.generateWorker = function(taskManager){
		if(_localCP < MAX_WORKER && _localCP < taskManager.length){
			console.log(_localCP, MAX_WORKER);
			cp.exec('node ' + __dirname + '/' + WORKER_FILE_NAME);
			// cp.fork(__dirname + '/' + WORKER_FILE_NAME);
			_localCP++;
		}else{
			cm.generateWorker();
		}
	}
	this.initWorker = function(){
		while(_localCP < MIN_WORKER){
			console.log(_localCP, MIN_WORKER);
			cp.exec('node ' + __dirname + '/' + WORKER_FILE_NAME);
			_localCP++;
		}
	}
	this.getLocalCPNUM = function(){
		return _localCP;
	}
	this.addCooperator = function(cooperator){
		cm.addCooperator(cooperator);
	}
}

function Cooperator(socket, id){
	var _id = socket.id||id;
	var _inUse = false;
	var _socket = socket;
	var _full = false;
	var _localCP = 0;
	var _MAX = 100;
	this.getID = function(){
		return _id;
	}
	this.getSocket = function(){
		return _socket;
	}
	this.setID = function(id){
		_id = id;
	}
	this.setSocket = function(socket){
		_socket = socket;
	}
	this.kill = function(){
		_socket.emit('kill');
	}
	this.getFull = function(){
		return _full;
	}
	this.setFull = function(full){
		_full = full;
	}
	this.generateWorker = function(){
		_socket.emit('generateWorker');
		_localCP ++;
		if(_localCP >= _MAX){
			this.setFull(true);
		}
	}
}

function CooperatorManager(){
	var _waiting = 0;
	var CooperatorList =function(){};
	var _list = [];
	this.generateWorker = function(){
		var cooperator = this.getTop();
		if( cooperator && !cooperator.getFull() ){
			cooperator.generateWorker();
		}else if( _waiting == 0 ) {
			_waiting ++;
			console.log('_waiting:', _waiting);
			/*
			控制生成频率
			*/
			var self = this;
			this.generateCooperator(function(){
				self.generateWorker();
			});
		}
	}
	this.addCooperator = function(cooperator){
		//var id = cooperator.getID();
		_waiting --;
		_list.unshift( cooperator );
		return [_list];
	}
	this.generateCooperator = function(cb){
		var cmd = 'node socket-test-cooperator.js';
		var option = {};
		var cb = undefined;
		cp.exec(cmd, option, cb);
	}
	this.getTop = function(){
		return _list[0];
	}
}

sList = {};
var wd = new WorkerDispatcher();

wd.initWorker(taskManager);

io.sockets.on('connection', function (socket) {
	//console.warn(socket);
	socket.emit('who', { hello: 'world' });
	socket.on('who', function (data) {
		var type = data.type;
		if(type == 'worker'){
			console.log("worker  : " , socket.id ,"added.");
			var worker = new Worker(socket);
			//console.warn(worker.getID());
			//sEle.setSocket(socket);
			wd.addNewWorker(worker);
			//console.log(wd.getList());
		}else if(type == 'cooperator'){
			console.log("cooperator  : " , socket.id ,"added.");
			var cooperator = new Cooperator(socket);
			wd.addCooperator(cooperator);
			socket.on('full', function (data) {
				var isFull = data.isFull;
				cooperator.setFull(isFull);
			});
		}
	});
	// http.get('/:n', function(req, res) {
	// 	app.send(req.toSource());
	// 	socket.emit('req', { req: req.url });
	// 	res.send(util.inspect(req.url));
	// });
});

io.sockets.on('disconnect', function (socket) {
	//console.warn(socket);
	var workerId = socket.id;
	wd.removeDeadWorker(workerId);
});

setInterval(function(){
	wd.killIdleWorker();
	console.log("host: check idle workers. num of workers is ",wd.getLocalCPNUM());
},10000);



http.createServer(function (req, res) {
	//res.writeHead(200, {'Content-Type': 'text/plain'});
	//res.end('Hello World\n');
	//console.log(req.url);
	var task = new Task(req, res);
	taskManager.add(task);
	
}).listen(1337, '127.0.0.1');


setInterval(function(){
	var task = taskManager.length > 0 ? taskManager.get() : undefined;

	if(task){
		var req = task.getReq();
		var res = task.getRes();
		proc(req, res);
	}

},3)



function proc(req, res) {
	if(req.url=='/debug' || req.url=='/favicon.ico' ){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(util.inspect(wd.getList()));
	}else{
		var worker=wd.getIdleWorker();
		if(worker){
			//addChild = false;
			var socket=worker.getSocket();
			socket.emit('req', { req: req.url });
			socket.on('res', function (data) {
				res.writeHead(200, {'Content-Type': 'text/plain'});
				//console.log( data.my );
				res.end(data.my.toString());
				wd.returnIdleWorker(worker);
			});
		}else{
			//addChild = true;
			wd.generateWorker(taskManager);
			var a = setInterval(function(){
				var worker=wd.getIdleWorker();
				if(worker){
					clearInterval(a);
					var socket=worker.getSocket();
					socket.emit('req', { req: req.url });
					socket.on('res', function (data) {
						res.writeHead(200, {'Content-Type': 'text/plain'});
						//console.log( data.my );
						res.end(data.my.toString());
						wd.returnIdleWorker(worker);
					});
				}
			},0);
		}
	}	
}


// var addingChild = setInterval(
// 	function(){
		
// 	}
// ,50);


// setInterval(function(){
// 	console.log(taskManager.st);
// },2000);
