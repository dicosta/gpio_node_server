var config      = require('../../config');
var data        = require('../model/data');
var gpioWrapper = require('../model/gpiowrapper');

var _this = this;

exports.readPin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);
  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      value = _this.doPinStateRead(gpioPin);
      return res.status(200).jsonp(value);
  }  
};

exports.writePin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);

  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      /*
      if (data.OFF === req.body.state || data.ON === req.body.state) {
          if (data.isBlinking(gpioPin)) {
              //signal to stop blinking 
              data.deleteBlinkState(gpioPin);
          }

          if (data.ON === req.body.state) {
              gpioWrapper.setPinHigh(gpioPin);
          } else {
              gpioWrapper.setPinLow(gpioPin);
          }
          data.storePinState(gpioPin, req.body.state);
          return res.status(200).jsonp(req.body.state);    
      } else if (data.BLINK === req.body.state) {
          if (data.isBlinking(gpioPin)) {
              //already blinking
              return res.status(400).send();
          } else {
              startBlinking(gpioPin);
              return res.status(200).jsonp(req.body.state);    
          }
      } else {
          //unknown state
          return res.status(400).send();
      }
      */
      if (_this.doPinStateWrite(gpioPin, req.body.state)) {
          return res.status(200).jsonp(req.body.state);    
      } else {
          return res.status(400).send();
      }
  }  
};

exports.findPins = function(req, res) {
  return res.status(200).jsonp(config.outputs);
};

exports.doPinStateRead = function(pinNumber) {
    return data.fetchPinState(gpioPin);
}

exports.doPinStateWrite = function(pinNumber, newState) {
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