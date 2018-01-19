var config      = require('../../config');
var pinModel    = require('../model/pinmodel');

exports.HTTPReadPin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);

  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      value = pinModel.readPin(gpioPin);
      return res.status(200).jsonp(value);
  }  
}

exports.HTTPWritePin = function(req, res) {
  gpioPin = parseInt(req.params.id, 10);
  newState = req.body.state;
  newBrightness = req.body.brightness

  if (!config.isOutputConfigured(gpioPin)) {
      return res.status(404).send();
  } else {
      if (pinModel.writePin(gpioPin, newState, newBrightness)) {
          return res.status(200).jsonp(newState);
      } else {
          return res.status(400).send();
      }
  }  
};

exports.HTTPFindPins = function(req, res) {
    return res.status(200).jsonp(pinModel.readAllPins());
}