exports.output_values = {};
exports.output_blink_state = {};

exports.ON = 'ON';
exports.OFF = 'OFF';
exports.BLINK = 'BLINK';

exports.storePinState = function(pinNumber, newState) {
    this.output_values[pinNumber] = newState;
}

exports.fetchPinState = function(pinNumber) {
    return this.output_values[pinNumber];
}

exports.initializeBlinkState = function(pinNumber) {
    this.output_blink_state[pinNumber] = false;
}

exports.deleteBlinkState = function(pinNumber) {
    delete this.output_blink_state[pinNumber];
}

exports.fetchBlinkState = function(pinNumber) {
    return this.output_blink_state[pinNumber];
}

exports.toggleBlinkState = function(pinNumber) {
    this.output_blink_state[pinNumber] = !this.output_blink_state[pinNumber];
}

exports.keepBlinking = function(pinNumber) {
    return this.output_blink_state.hasOwnProperty(pinNumber);
}

exports.isBlinking = function(pinNumber) {
    return this.BLINK === this.output_values[pinNumber];
}