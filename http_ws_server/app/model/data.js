exports.output_values = [];
exports.output_blink_state = {};

exports.ON = 'ON';
exports.OFF = 'OFF';
exports.BLINK = 'BLINK';
exports.DIM = 'DIM';


var _this = this;

exports.storePin = function(pinNumber, newState, brightness) {
    var pinItem = _this.fetchPin(pinNumber);

    if (pinItem) {
    	pinItem.state = newState;  

    	if (this.DIM === newState) {
	    	if (brightness) {
	    		pinItem.brightness = brightness;
	    	} else {
	    		pinItem.brightness = 1;
	    	}
    	} else {
    		delete pinItem.brightness;    		
    	}

    } else {
    	var newPinItem = {
    		id : parseInt(pinNumber),
    		state : newState
    	};

    	if (brightness && this.DIM === newState) {
    		newPinItem.brightness = brightness;
    	} 
    	
    	this.output_values.push(newPinItem);
    }
}

exports.fetchPin = function(pinNumber) {
    var pinItem = _this.output_values.filter(function (output) {
        return output.id === parseInt(pinNumber);
    })[0];	

    return pinItem;
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
    var pinItem = _this.fetchPin(pinNumber);

    if (pinItem) {
    	return this.BLINK === pinItem.state;
    } else {
    	return false;
    }
}

exports.isDimmed = function(pinNumber) {
    var pinItem = _this.fetchPin(pinNumber);

    if (pinItem) {
        return this.DIM === pinItem.state;
    } else {
        return false;
    }
}