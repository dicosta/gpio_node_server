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


pinModel.eventBus.on('model-changed', function() {
   	wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(pinModel.readAllPins()));
    });
});


wss.on('connection', function connection(connection) {
	console.log('new Client Connection established...');

	connection.on('message', function incoming(message) {
		var request = JSON.parse(message);
		if (ACTION_WRITE === request.action) {
			console.log('received: ' + message);
			pinModel.writePin(request.id, request.state, request.brightness);
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