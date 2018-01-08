var bleno = require('bleno');
var gpioService = require('./gpio-service');

var primaryService = new GPIOService();


console.log('gpio - gatt server');


bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('GPIO', [primaryService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([primaryService], function(error) {
            console.log('setServices: '  + (error ? 'error ' + error : 'success'));
        });
    }
});
