var util = require('util');
var bleno = require('bleno');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;
var value = ''

var GPIOCharacteristicSetup = function(socket) {
  this._value = '';

  var _this = this;
  function incomingDataFromWS(data) {
    console.log('<SETUP> Received data from WS: ' + data);
    _this._value = data;    

    socket.removeListener('message', incomingDataFromWS);
  };

  socket.on('message', incomingDataFromWS);    

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
};

util.inherits(GPIOCharacteristicSetup, Characteristic);


GPIOCharacteristicSetup.prototype.onReadRequest = function(offset, callback) {
  if (offset > 0) {
    data = this._value.slice(offset);
  } else {
    data = this._value;
  }

  console.log('<SETUP> Returning: ' + data);
  buffer = new Buffer(data.length);
  buffer.write(data);            
  callback(this.RESULT_SUCCESS, buffer);      
};

module.exports = GPIOCharacteristicSetup;
