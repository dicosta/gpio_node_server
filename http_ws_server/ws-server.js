var WSServer  = require('ws').Server;
var server    = require('http').createServer();
var config    = require('./config'); 

var app       = require('./server');
var PinController = require('./app/controllers/pins');

// Create web socket server on top of a regular http server
var wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(connection) {
	console.log('new Client Connection established...');

	connection.on('message', function incoming(message) {
		//console.log(`received: ${message}`);
		//connection.send(JSON.stringify({answer: 42}));
		var request = JSON.parse(message);
		console.log('received: ' + message);
		if (PinController.writePin(request.id, request.state)) {
			connection.send(JSON.stringify('OK! New State Applied!'));
		} else {
			connection.send(JSON.stringify('Error'));
		}
	});

	connection.on('close', function(connection) {
  		console.log('Connection Closed');
  	});

	//we greet new connections with the list of pins we can handle...
	connection.send(JSON.stringify(config.getOutputs()));
});


var port = process.env.PORT || 8080; 
server.listen(port, function() {	
  console.log('HTTP/WS Server listening on port : ' + port);
});