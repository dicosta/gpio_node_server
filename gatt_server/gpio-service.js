var util = require('util');
var bleno = require('bleno');
var WebSocket = require('ws');

var BlenoPrimaryService = bleno.PrimaryService;

var GPIOCharacteristicSetup = require('./gpio-characteristic-setup');
var GPIOCharacteristicRead = require('./gpio-characteristic-read');
var GPIOCharacteristicWrite = require('./gpio-characteristic-write');

function GPIOService() {
	var ws = new WebSocket('ws://localhost:8080');

	GPIOService.super_.call(this, {
	  uuid: '13333333333333333333333333333337',
	  characteristics: [
	  	  new GPIOCharacteristicSetup(ws),
	      new GPIOCharacteristicRead(ws),
	      new GPIOCharacteristicWrite(ws)
	  ]
	});
}

util.inherits(GPIOService, BlenoPrimaryService);

module.exports = GPIOService;