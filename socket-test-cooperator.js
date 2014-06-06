var ioClient = require('socket.io-client');
var port = Math.floor( Math.random() * 50000 + 6000);
var ioServer = require('socket.io').listen(port,{'log level': 1});
var cp = require('child_process');
var WORKER_FILE_NAME = 'socket-test-worker.js';
var numCPUs = require('os').cpus().length;

var MIN_WORKER = parseInt(process.argv[2])>numCPUs ? process.argv[2] : numCPUs;
var MAX_WORKER = parseInt(process.argv[3])>MIN_WORKER ? parseInt(process.argv[3]) : numCPUs;
console.log(port, process.argv[2], process.argv[3]);
console.log(port, MIN_WORKER ,MAX_WORKER);
var i = 0;
/*================= 
connect to master
==================*/
var mySocket = ioClient.connect('http://localhost:6501', {reconnect: true});

mySocket.emit('ready', {maxWorker : MAX_WORKER});
mySocket.on('kill', function(){
  console.log("cooperator exited");
  process.exit(0);
})
/*================= 
when my worker connects
==================*/
var wd = new WorkerDispatcher();
ioServer.sockets.on('connection', function (socket) {
  /*================= 
  when my worker ready
  ==================*/
  socket.on('ready', function (data) {
    console.log("host " + port + " : " , socket.id ,"added.");
    var worker = new Worker(socket);
    wd.addNewWorker(worker);
    socket.on('res', function (data) {
      //console.log( data.my );
      mySocket.emit('res', data);
      wd.returnIdleWorker(worker);
    });
  });
});

/*================= 
when my worker disconnect
==================*/
ioServer.sockets.on('disconnect', function (socket) {
  var workerId = socket.id;
  wd.removeDeadWorker(workerId);
});


reqManager = new Array();

wd.initWorker(reqManager);


/*================= 
when request comes
==================*/
mySocket.on('req',function(reqData){
  var data = reqData;
  reqManager.push(reqData);
  //console.log("host " + port + " : " , reqManager.length);
})


setInterval(function(){
  //cm.setDesNum(taskManager.length);//set worker number
  var reqObj = reqManager.length > 0 ? reqManager[0]: undefined;

  if(reqObj){
    proc(reqManager);
  }

},0)

 setInterval(function(){
  wd.killIdleWorker();
  console.log("host "+ port +": check idle workers. num of workers is ",wd.getLocalCPNUM());
 },10000);


function proc(reqManager){

  //console.warn(reqObj);
  var worker=wd.getIdleWorker();
    if(worker){
      //console.log('get one');
      var socket=worker.getSocket();
      socket.emit('req', reqManager.shift() );

    }else{
      //console.log('generate one');
      wd.generateWorker(reqManager);
    }
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
  //private
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


  //public
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
    _localCP --;
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
      console.log("host " + port + " idel: ", ids.length);
      var id = ids[0];
      var worker = _getWorkerFrom(id, _idle);
      worker.kill();
      //_localCP--;
      this.removeDeadWorker(worker);
      return [_idle,_busy];
    }
  }
  this.generateWorker = function(taskManager){
    //console.log(_localCP, taskManager.length);
    if(_localCP < MAX_WORKER && _localCP < taskManager.length){
      //console.log(_localCP, MAX_WORKER);
      //cp.exec('node ' + __dirname + '/' + WORKER_FILE_NAME);
      cp.fork(WORKER_FILE_NAME, [port]);
      _localCP++;
    }
  }
  this.initWorker = function(){
    while(_localCP < MIN_WORKER){
      //console.log(_localCP, MIN_WORKER);
      cp.fork(WORKER_FILE_NAME, [port]);
      _localCP++;
    }
  }
  this.getLocalCPNUM = function(){
    return _localCP;
  }

}