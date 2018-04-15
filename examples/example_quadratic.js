// Examples in optimization-js are unit tested to ensure that they are working a-ok (see howtos/make_examples.md).
if(optimjs == null){ // this is necessary for automated testing of example in node.js
    var optimjs = require('../src/optimization') // this is run in node.js only
}
 
// define some objective function that is to be minimized
// this is a convex function with the unique global optimum at [1.0, 0.0, -2.0]
var objective = function (x) {
    return (x[0]-1.0)*(x[0]-1.0) + (x[1]+0.5)*(x[1]+0.5) + (x[2]+2.0)*(x[2]+2.0)
}

// gradient of objective
var gradient = function (x) {
    return [2.0*(x[0]-1.0), 2.0*(x[1]+0.5), 2.0*(x[2]+2.0)]
}

function example_minimization_powell(){
    // Example minimization using Powell method.   
    // the size of the input to the function being optimized is determined by the initialization vector
    var x0 = [1.2, 2.0, -3.1]

    // minimize the function using 0 order minimization method!
    var solution = optimjs.minimize_Powell(objective, x0)
    
    // below is used for automated tests of examples
    return solution
}

function example_minimization_gd(){
    // Example minimization using gradient descent method. 
    // the size of the input to the function being optimized is determined by the initialization vector
    var x0 = [1.2, 2.0, -3.1]

    // minimize the function
    var solution = optimjs.minimize_GradientDescent(objective, gradient, x0)
    
    // below is used for automated tests of examples
    return solution
}

function example_minimization_lbfgs(){
    // Example minimization using L-BFGS method. 
    // the size of the input to the function being optimized is determined by the initialization vector
    var x0 = [1.2, 2.0, -3.1]

    // minimize the function
    var solution = optimjs.minimize_L_BFGS(objective, gradient, x0)
    
    // below is used for automated tests of examples
    return solution
}

// Below code is necessary for testing in node.js only. It has nothing to do with the examples above.
exports = typeof module != 'undefined' && module.exports;  // add exports to module.exports if in node.js

// record the 
exports.example_minimization_powell = example_minimization_powell
exports.example_minimization_gd = example_minimization_gd
exports.example_minimization_lbfgs = example_minimization_lbfgs
