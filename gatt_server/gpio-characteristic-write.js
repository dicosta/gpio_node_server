var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var GPIOCharacteristicWrite = function() {
  GPIOCharacteristicWrite.super_.call(this, {
    uuid: '13333333333333333333333333330002',
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
  }
  else if (data.length !== 2) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    var temperature = data.readUInt16BE(0);
    var self = this;
    var data = new Buffer(1);
    
    data.writeUInt8(result, 0);
    self.updateValueCallback(data);
    callback(this.RESULT_SUCCESS);
  }
};

module.exports = GPIOCharacteristicWrite;
