var data        = require('../model/data')
var gpio        = require('rpio');
var EventEmitter = require('events').EventEmitter;
var eventBus = new EventEmitter();

exports.initializeWrapper = function() {
	gpio.init({mapping: 'gpio'});
}

exports.setPinLow = function(pinNumber) {
	gpio.open(pinNumber, gpio.OUTPUT);
    gpio.write(pinNumber, gpio.LOW);
    gpio.close(gpioPin, gpio.PIN_PRESERVE);
}

exports.setPinHigh = function(pinNumber) {
	gpio.open(pinNumber, gpio.OUTPUT);
    gpio.write(pinNumber, gpio.HIGH);
    gpio.close(gpioPin, gpio.PIN_PRESERVE);
}

exports.configureButton = function(inputPinNumber, outputPinNumber) {	
	gpio.open(inputPinNumber, gpio.INPUT, gpio.PULL_UP);

	function pollCallback(pin)
	{
		if (!gpio.read(pin)) {
			eventBus.emit('input-changed', outputPinNumber);
		}
	}

	gpio.poll(inputPinNumber, pollCallback);
}

exports.eventBus = eventBus;