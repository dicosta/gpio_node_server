var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var GPIOCharacteristicWrite = function(socket) {
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

  this._socket = socket;
};

util.inherits(GPIOCharacteristicWrite, Characteristic);

GPIOCharacteristicWrite.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  } else {
    json = JSON.parse(data);
    this._socket.send(JSON.stringify(json), function(){
      callback(this.RESULT_SUCCESS);                      
    }); 
  }
};

module.exports = GPIOCharacteristicWrite;
