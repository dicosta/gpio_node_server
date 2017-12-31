var config      = require('../../config');
var data        = require('../model/data')
var gpio        = require('rpio');

exports.readPin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);
  if (config.outputs.indexOf(gpioPin) < 0) {
      return res.status(404).send();
  } else {
      value = data.fetchPinState(gpioPin);
      return res.status(200).jsonp(value);
  }  
};

exports.writePin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);

  if (config.outputs.indexOf(gpioPin) < 0) {
      return res.status(404).send();
  } else {
      if (data.OFF === req.body.state || data.ON === req.body.state) {
          if (data.isBlinking(gpioPin)) {
              //signal to stop blinking 
              data.deleteBlinkState(gpioPin);
          }
          gpio.open(gpioPin, gpio.OUTPUT);        
          gpio.write(gpioPin, (data.ON === req.body.state) ? gpio.HIGH : gpio.LOW);
          gpio.close(gpioPin, gpio.PIN_PRESERVE);
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
  }  
};

function startBlinking(pinNumber) {
    data.initializeBlinkState(pinNumber);
    data.storePinState(pinNumber, data.BLINK);

    var blinkInterval = setInterval(toggleLED, 200); //run the toggleLED function every 200s

    function toggleLED() {
        if (data.keepBlinking(pinNumber)) {
            gpio.open(pinNumber, gpio.OUTPUT);  
            gpio.write(pinNumber, data.fetchBlinkState(pinNumber) ? gpio.HIGH : gpio.LOW);
            gpio.close(pinNumber, gpio.PIN_PRESERVE);
            data.toggleBlinkState(pinNumber);
        } else {
            clearInterval(blinkInterval);
        }
    }
}