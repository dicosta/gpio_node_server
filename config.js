exports.outputs 		 = [13, 21];
exports.inputs  		 = [18];
exports.rel_input_output = {18 : 21};  

exports.getOutputForInput = function(pinNumber) {
	return this.rel_input_output[pinNumber];
}