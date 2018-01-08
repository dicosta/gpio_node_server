var config      = require('../../config');
var data        = require('../model/data');
var gpioWrapper = require('../model/gpiowrapper');

var _this = this;

exports.HTTPReadPin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);

  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      value = _this.readPin(gpioPin);
      return res.status(200).jsonp(value);
  }  
}

exports.HTTPWritePin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);
  newState = req.body.state;

  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      if (_this.writePin(gpioPin, newState)) {
          return res.status(200).jsonp(newState);
      } else {
          return res.status(400).send();
      }
  }  
};

exports.HTTPFindPins = function(req, res) {
  return res.status(200).jsonp(config.outputs);
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