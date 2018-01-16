var bleno = require('bleno');
var GPIOService = require('./gpio-service');
var gpio        = require('rpio');

var primaryService = new GPIOService();

var ledPinIndicator = 21;


console.log('GPIO - Gatt Server Intializing...');

gpio.init({mapping: 'gpio'});


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
        setLedBlink();

        bleno.setServices([primaryService], function(error) {
            console.log('setServices: '  + (error ? 'error ' + error : 'success'));
        });
    }
});

bleno.on('accept', function(clientAddress) {
  setLedSolid();
  console.log('on -> accept, client: ' + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
  setLedBlink();
  console.log('on -> disconnect, client: ' + clientAddress);
});

bleno.on('rssiUpdate', function(rssi) {
  console.log('on -> rssiUpdate: ' + rssi);
});

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu);
});


var blinkState = false;
var keepBlinking = false;


function setLedBlink() {
    if (!keepBlinking) {
        keepBlinking = true;

        var blinkInterval = setInterval(toggleLED, 200); //run the toggleLED function every 200s

        function toggleLED() {
            if (keepBlinking) {

                if (blinkState) {
                    gpio.open(ledPinIndicator, gpio.OUTPUT);
                    gpio.write(ledPinIndicator, gpio.HIGH);
                    gpio.close(ledPinIndicator, gpio.PIN_PRESERVE);
                } else {
                    gpio.open(ledPinIndicator, gpio.OUTPUT);
                    gpio.write(ledPinIndicator, gpio.LOW);
                    gpio.close(ledPinIndicator, gpio.PIN_PRESERVE);
                }

                blinkState = !blinkState;
            } else {
                clearInterval(blinkInterval);
            }
        }
    }
}

function setLedSolid() {
  keepBlinking = false;

  gpio.open(ledPinIndicator, gpio.OUTPUT);
  gpio.write(ledPinIndicator, gpio.HIGH);
  gpio.close(ledPinIndicator, gpio.PIN_PRESERVE);
}