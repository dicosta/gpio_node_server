var config      = require('../../config');
var data        = require('../model/data');
var gpioWrapper = require('../model/gpiowrapper');
var EventEmitter = require('events').EventEmitter;
var eventBus = new EventEmitter();

exports.readAllPins = function() {
    return data.output_values;
}

exports.findPins = function() {
    return config.getOutputs();
}

exports.readPin = function(pinNumber) {
    return data.fetchPinState(gpioPin);
};

exports.writePin = function(pinNumber, newState) {
    if (data.OFF === newState || data.ON === newState) {
        if (data.isBlinking(pinNumber)) {
            //signal to stop blinking 
            data.deleteBlinkState(pinNumber);
        }

        if (data.ON === newState) {
            gpioWrapper.setPinHigh(pinNumber);
        } else {
            gpioWrapper.setPinLow(pinNumber);
        }
        data.storePinState(pinNumber, newState);
        eventBus.emit('model-changed');
        return true;
    } else if (data.BLINK === newState) {
        if (data.isBlinking(pinNumber)) {
            //already blinking
            return false
        } else {
            startBlinking(pinNumber);
            return true
        }
    } else {
        //unknown state
        return false
    }    
}

function startBlinking(pinNumber) {
    data.initializeBlinkState(pinNumber);
    data.storePinState(pinNumber, data.BLINK);
    eventBus.emit('model-changed');

    var blinkInterval = setInterval(toggleLED, 200); //run the toggleLED function every 200s

    function toggleLED() {
        if (data.keepBlinking(pinNumber)) {

            if (data.fetchBlinkState(pinNumber)) {
                gpioWrapper.setPinHigh(pinNumber);
            } else {
                gpioWrapper.setPinLow(pinNumber);
            }

            data.toggleBlinkState(pinNumber);
        } else {
            clearInterval(blinkInterval);
        }
    }
}

exports.eventBus = eventBus;