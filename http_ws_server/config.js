exports.outputs = [{'id': 13, 'color': 'GREEN'}, {'id':21, 'color': "BLUE"}];
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