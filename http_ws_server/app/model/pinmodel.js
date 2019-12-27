var config      = require('../../config');
var data        = require('../model/data');
var gpioWrapper = require('../model/gpiowrapper');
var EventEmitter = require('events').EventEmitter;
var eventBus = new EventEmitter();
var NanoTimer = require('nanotimer');
var nanoTimer = new NanoTimer();

var _this = this;

exports.readAllPins = function() {
    return data.output_values;
}

exports.findPins = function() {
    return config.getOutputs();
}

exports.readPinState = function(pinNumber) {
    return data.fetchPin(pinNumber).state;
};

exports.readPin = function(pinNumber) {
    return data.fetchPin(pinNumber)
};

exports.writePin = function(pinNumber, newState, newBrightness) {
    if (data.OFF === newState || data.ON === newState) {
        if (data.isBlinking(pinNumber)) {
            //signal to stop blinking 
            data.deleteBlinkState(pinNumber);
        }

        data.storePin(pinNumber, newState);

        if (data.ON === newState) {
            gpioWrapper.setPinHigh(pinNumber);
        } else {
            gpioWrapper.setPinLow(pinNumber);
        }        

        eventBus.emit('model-changed'); //notify listeners
        return true;
    } else if (data.BLINK === newState) {
        if (data.isBlinking(pinNumber)) {
            //already blinking
            return false
        } else {
            startBlinking(pinNumber);
            return true
        }
    } else if (data.DIM === newState && config.isDimmable(pinNumber)) {
        if (data.isBlinking(pinNumber)) {
            //signal to stop blinking 
            data.deleteBlinkState(pinNumber);
        }

        var brigthness;

        if (newBrightness) {
            brigthness = newBrightness;
        } else {
            brigthness = 1;
        }

        setDimLevel(pinNumber, brigthness);
        return true;

    } else {
        //unknown state
        return false
    }    
}

exports.initializePin = function(pinItem) {
    data.createPin(pinItem);
    _this.writePin(parseInt(pinItem.id), data.OFF);
}

function startBlinking(pinNumber) {
    data.initializeBlinkState(pinNumber);
    data.storePin(pinNumber, data.BLINK);
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

function setDimLevel(pinNumber, brigthness) {
    alreadyDimmed = data.isDimmed(pinNumber);
    data.storePin(pinNumber, data.DIM, brigthness);

    eventBus.emit('model-changed');
    
    var pinItem = data.fetchPin(pinNumber)    

    gpioWrapper.setPWMPinLevel(pinNumber, brigthness, alreadyDimmed);   
}

gpioWrapper.eventBus.on('input-changed', function(pinNumber) {
    if (data.fetchPin(pinNumber).state === data.OFF) {
        _this.writePin(pinNumber, data.ON);
    } else {
        _this.writePin(pinNumber, data.OFF);
    }
});


exports.eventBus = eventBus;