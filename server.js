// ======================
// Dependencies
// ======================
var http        = require('http');
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var app         = express();
var async       = require("async");
var gpioWrapper = require('./app/model/gpiowrapper');


// =====================
// Controllers
// =====================
var PinController = require('./app/controllers/pins');


// =======================
// Configuration
// =======================
var port = process.env.PORT || 8080; 
var config = require('./config'); 
var data = require('./app/model/data')

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.disable('etag'); //prevent 304

// use morgan to log requests to the console
app.use(morgan('dev'));

gpioWrapper.initializeWrapper();

// =======================
// API Routes
// =======================

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API Routes
// get an instance of the router for api routes
var apiRoutes = express.Router();


// Route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.status(200).json('Welcome to Basic Server API');
});

//Pin Routes
apiRoutes.route('/pins/:id')  
  .get(PinController.readPin)
  .put(PinController.writePin);

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// Start the Server
// =======================
console.log('Initializing OUTPUT pins...')

async.forEachOf(config.outputs, function (value, key, callback) {
    gpioPin = config.outputs[key];
    console.log('Initializing with LOW Pin: #' + gpioPin);
    gpioWrapper.setPinLow(gpioPin);      
    data.storePinState(gpioPin, data.OFF);
    callback();
}, function (err) {
      if (err) console.error(err.message);       
});

for (var i = 0, len = config.inputs.length; i < len; i++) {
    gpioWrapper.configureButton(config.inputs[i], config.getOutputForInput(config.inputs[i]));     
}

app.listen(port);
console.log('Server listening at http://localhost:' + port);