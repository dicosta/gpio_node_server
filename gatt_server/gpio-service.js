var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var GPIOCharacteristicSetup = require('./gpio-characteristic-setup');
var GPIOCharacteristicRead = require('./gpio-characteristic-read');
var GPIOCharacteristicWrite = require('./gpio-characteristic-write');

function GPIOService() {
  GPIOService.super_.call(this, {
      uuid: '13333333333333333333333333333337',
      characteristics: [
      	  new GPIOCharacteristicSetup(),
          new GPIOCharacteristicRead(),
          new GPIOCharacteristicWrite()
      ]
  });
}

util.inherits(GPIOService, BlenoPrimaryService);

module.exports = GPIOService;