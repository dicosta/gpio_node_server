var WSServer  = require('ws').Server;
var server    = require('http').createServer();

var app       = require('./server');
var pinModel = require('./app/model/pinmodel');


var ACTION_WRITE = 'WRITE';
var ACTION_READ = 'READ'

// Create web socket server on top of a regular http server
var wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(connection) {
	console.log('new Client Connection established...');

	pinModel.eventBus.on('model-changed', function() {
		if (connection.readyState !== connection.OPEN) {
			console.log('connection state is not OPEN'); //TODO: fix : unsuscribe this connection from model bus
		} else {
			connection.send(JSON.stringify(pinModel.readAllPins()));
		}
	});

	connection.on('message', function incoming(message) {
		var request = JSON.parse(message);
		if (ACTION_WRITE === request.action) {
			console.log('received: ' + message);
			pinModel.writePin(request.id, request.state);
		} else {
			if (request.id !== undefined) {
				connection.send(JSON.stringify(pinModel.readPin(request.id)));
			} else {
				connection.send(JSON.stringify(pinModel.readAllPins()));
			}
		}
	});

	connection.on('close', function(connection) {
  		console.log('Connection Closed');
  	});

	//we greet new connections with the list of pins we can handle...
	connection.send(JSON.stringify(pinModel.findPins()));
});


var port = process.env.PORT || 8080; 
server.listen(port, function() {	
  console.log('HTTP/WS Server listening on port : ' + port);
});