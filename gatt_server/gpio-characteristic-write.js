var util = require('util');
var bleno = require('bleno');
var WebSocket = require('ws');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var GPIOCharacteristicWrite = function() {
  GPIOCharacteristicWrite.super_.call(this, {
    uuid: '13333333333333333333333333330003',
    properties: ['write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Write Pins Status'
      })
    ]
  });
};

util.inherits(GPIOCharacteristicWrite, Characteristic);

GPIOCharacteristicWrite.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  } else {
    var ws = new WebSocket('ws://localhost:8080');

    json = JSON.parse(data);

    ws.on('open', function incoming(data) {       
      ws.send(JSON.stringify(json), function(){
        ws.close(1000, 'done');
        callback(this.RESULT_SUCCESS);                      
      }); 
    }.bind(this));
    ws.on('error', function fail(error) {
      ws.close(1000, 'done');
      callback(this.RESULT_UNLIKELY_ERROR);      
    }.bind(this));  
  }
};

module.exports = GPIOCharacteristicWrite;
