var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;


var GPIOCharacteristicRead = function(socket) {
  var _this = this;
  
  function incomingDataFromWS(data) {
    console.log('<SUBSCRIPTION> Received data from WS: ' + data);
    _this._indicateDataStack = new Buffer(data);

    if (_this._updateValueCallback) {      
      value = _this.getNextChunkToIndicate(_this._indicateDataStack)
      if (value.length > 0) {
          console.log('<SUBSCRIPTION> Pushing: ' + value);
          _this._updateValueCallback(value)
      }
    } else {
      console.log('<SUBSCRIPTION> No suscribers to notify/indicate');
    }
  };

  GPIOCharacteristicRead.super_.call(this, {
    uuid: '13333333333333333333333333330002',
    properties: ['read', 'indicate'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Read Pins Status'
      })
    ]
  });

  this._updateValueCallback = null;

  this._socket = socket;
  this._socket.on('message', incomingDataFromWS);

  this._forcedMTUSize = 20;

  this._readValueData = new Buffer(0);
  this._indicateDataStack = new Buffer(0);
};

util.inherits(GPIOCharacteristicRead, Characteristic);

GPIOCharacteristicRead.prototype.onReadRequest = function(offset, callback) {
  var _this = this;
  
  function singleRead(data) {
      //removes myself
      _this._socket.removeListener('message', singleRead);

      console.log('<READ> Fetched from Server: ' + data);
      
      _this._readValueData = new Buffer(data);
      callback(_this.RESULT_SUCCESS, _this._readValueData);      
  };

  if (offset > 0) {
    callback(this.RESULT_SUCCESS, this._readValueData.slice(offset));
  } else {
    //triggers a WS push
    this._socket.send(JSON.stringify({'action' : 'READ'}));
    this._socket.on('message', singleRead);
  }
};

GPIOCharacteristicRead.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('GPIOCharacteristicRead Client subscribed');

  this._updateValueCallback = updateValueCallback;
};

GPIOCharacteristicRead.prototype.onUnsubscribe = function() {
  console.log('GPIOCharacteristicRead Client unsubscribed');

  this._updateValueCallback = null;
};

GPIOCharacteristicRead.prototype.onIndicate = function() {
  var _this = this;

  //NOTE: setTimeout needed to workaround stalling issue with onindicate & updatevaluecallback.
  setTimeout(function() { 
    value = _this.getNextChunkToIndicate(_this._indicateDataStack)
    if (value.length > 0) {
        console.log('<SUBSCRIPTION> Pushing: ' + value);
        _this._updateValueCallback(value)
    }
  }, 1);
}

GPIOCharacteristicRead.prototype.getNextChunkToIndicate = function(data) {
    var chunk;
    if (data.length > this._forcedMTUSize) {
        chunk = data.slice(0, this._forcedMTUSize);
        this._indicateDataStack = data.slice(this._forcedMTUSize);
    } else {
        chunk = data;
        this._indicateDataStack = new Buffer(0);
    }
    return chunk;
}

module.exports = GPIOCharacteristicRead;
