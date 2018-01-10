var util = require('util');
var bleno = require('bleno');
var WebSocket = require('ws');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

//const ws = new WebSocket('ws://localhost:8080');
//var lastData = '';

//ws.on('message', function incoming(data) {
//    console.log('received from ws: ' + data);
//    lastData = data;
//});

var GPIOCharacteristicRead = function() {
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
};

util.inherits(GPIOCharacteristicRead, Characteristic);

GPIOCharacteristicRead.prototype.onReadRequest = function(offset, callback) {
  var result = this.RESULT_SUCCESS;


  //var data = lastData.replace(/(\r\n|\n|\r)/gm,"");
  //data = parseInt(data);
  //console.log ("last value "+data);

  //var buffer = new Buffer(4); // arg to Buffer is size in bytes
  //buffer.writeUInt32LE(data, 0); // fill in bytes
  //var buffer = new Buffer(lastData);




  //var message = new Buffer(data.length);
  /*
  var data = new Buffer(lastData.length);

  for (var i = 0; i < data.length; i++) {
      data[i] = lastData[i];
  }
  */
  if (offset > lastData.length) {
      result = this.RESULT_INVALID_OFFSET;
      buffer = null;
  } else {
      buffer = Buffer.from(lastData.slice(offset));
      console.log('buffer: ' + buffer);
  }
  

  callback(result, buffer);  
};



module.exports = GPIOCharacteristicRead;
