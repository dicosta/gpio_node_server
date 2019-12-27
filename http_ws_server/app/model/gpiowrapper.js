var gpio        = require('rpio');
var EventEmitter = require('events').EventEmitter;
var eventBus = new EventEmitter();

var refresh_rate = 64;
var pwm_max = 100;

exports.initializeWrapper = function() {
	gpio.init({mapping: 'gpio', gpiomem: false});
}

exports.setPinLow = function(pinNumber) {
	gpio.open(pinNumber, gpio.OUTPUT);
    gpio.write(pinNumber, gpio.LOW);
    gpio.close(pinNumber, gpio.PIN_PRESERVE);
}

exports.setPinHigh = function(pinNumber) {
	gpio.open(pinNumber, gpio.OUTPUT);
    gpio.write(pinNumber, gpio.HIGH);
    gpio.close(pinNumber, gpio.PIN_PRESERVE);
}

exports.setPWMPinLevel = function(pinNumber, level, alreadyDimmed) {       
	gpio.open(pinNumber, gpio.PWM);
    if (!alreadyDimmed) {
      gpio.pwmSetClockDivider(refresh_rate);
      gpio.pwmSetRange(pinNumber, pwm_max);
    }
    gpio.pwmSetData(pinNumber, parseInt(level,10));
    gpio.close(pinNumber, gpio.PIN_PRESERVE);
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