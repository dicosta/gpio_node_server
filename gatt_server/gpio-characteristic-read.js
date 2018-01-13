var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;


var GPIOCharacteristicRead = function(socket) {
  this._lastValueRead = '';

  var _this = this;
  function incomingDataFromWS(data) {
    console.log('<READ_SUSCRIPTION> Received data from WS: ' + data);
    _this._lastValueRead = data;
  };

  GPIOCharacteristicRead.super_.call(this, {
    uuid: '13333333333333333333333333330002',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Read Pins Status'
      })
    ]
  });

  this._socket = socket;
  this._socket.on('message', incomingDataFromWS);
};

util.inherits(GPIOCharacteristicRead, Characteristic);

GPIOCharacteristicRead.prototype.onReadRequest = function(offset, callback) {
  var _this = this;
  function singleRead(data) {
      _this._socket.removeListener('message', singleRead);

      console.log('<READ> Returning: ' + data);

      buffer = new Buffer(data.length);      
      buffer.write(data);            
      callback(_this.RESULT_SUCCESS, buffer);      
  };

  if (offset > 0) {
    data = this._lastValueRead.slice(offset);
    buffer = new Buffer(data.length);      
    buffer.write(data);            
    callback(this.RESULT_SUCCESS, buffer);     
  } else {
    this._socket.send(JSON.stringify({'action' : 'READ'}));
    this._socket.on('message', singleRead);
  }
};



module.exports = GPIOCharacteristicRead;
