exports.outputs = [{'id': 13, 'color': 'GREEN', 'dimmable' : true, 'name' : 'Green LED in PIN #13' }, 
                   {'id':20, 'color': "YELLOW", 'dimmable' : false, 'name' : 'Yellow LED in PIN #20'}, 
                   {'id':16, 'color': "RED", 'dimmable' : false, 'name' : 'Red LED in PIN #16'}];
exports.inputs  = [18];
exports.rel_input_output = {18 : 13};

exports.getOutputForInput = function(pinNumber) {
    return this.rel_input_output[pinNumber];
}

exports.getOutputsIds = function() {
    return this.outputs.map(function(output, index, array) {
        return output.id;
    });
}

exports.getOutputs = function() {
    return this.outputs;
}

exports.isOutputConfigured = function(pinNumber) {
    return (this.outputs.filter(function (output) {
        return output.id === pinNumber;
    })).length > 0;
}

exports.isDimmable = function(pinNumber) {
    var pinItem = this.outputs.filter(function (output) {
        return output.id === parseInt(pinNumber);
    })[0];

    if (pinItem) {    	
    	return pinItem.dimmable;
    } else {
    	return false;
    }
}
