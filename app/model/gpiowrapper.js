var data        = require('../model/data')
var gpio        = require('rpio');

var _this = this;

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
			if (data.fetchPinState(gpioPin) === data.OFF) {
				_this.setPinHigh(outputPinNumber);
				data.storePinState(gpioPin, data.ON);
			} else {
				_this.setPinLow(outputPinNumber);				
				data.storePinState(gpioPin, data.OFF);
			}
		}
	}

	gpio.poll(inputPinNumber, pollCallback);
}