var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var GPIOCharacteristicRead = function() {
  GPIOCharacteristicRead.super_.call(this, {
    uuid: '13333333333333333333333333330001',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Read Pins Status'
      })
    ]
  });
};

util.inherits(GPIOCharacteristicRead, Characteristic);

GPIOCharacteristicRead.prototype.onReadRequest = function(offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = new Buffer(1);
    data.writeUInt8(1, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};



module.exports = GPIOCharacteristicRead;
