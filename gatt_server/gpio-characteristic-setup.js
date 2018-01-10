var util = require('util');
var bleno = require('bleno');
var WebSocket = require('ws');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var GPIOCharacteristicSetup = function() {
  GPIOCharacteristicSetup.super_.call(this, {
    uuid: '13333333333333333333333333330001',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Reads Peripheral Setup'
      })
    ]
  });

  this._value = '';
};

util.inherits(GPIOCharacteristicSetup, Characteristic);


GPIOCharacteristicSetup.prototype.onReadRequest = function(offset, callback) {
  if (offset > 0) {
    data = this._value.slice(offset);

    console.log('<SETUP> Returning: ' + data);
    
    buffer = new Buffer(data.length);
    buffer.write(data);            
    callback(this.RESULT_SUCCESS, buffer);      
  } else {
    console.log('<SETUP> Opening Connection');
    var ws = new WebSocket('ws://localhost:8080');

    ws.on('message', function incoming(data) {      
      console.log('<SETUP> Received from ws-server: ' + data);
      console.log('<SETUP> Closing Connection');
      ws.close(1000, 'done');
      this._value = data;

      buffer = new Buffer(this._value.length);
      console.log('<SETUP> Returning: ' + this._value);
      buffer.write(this._value);            
      callback(this.RESULT_SUCCESS, buffer);      
    }.bind(this));
    ws.on('error', function fail(error) {
      ws.close(1000, 'done');
      callback(this.RESULT_UNLIKELY_ERROR, null);      
    }.bind(this));  
  }
};

module.exports = GPIOCharacteristicSetup;
