// Examples in optimization-js are unit tested to ensure that they are working a-ok (see howtos/make_examples.md).
if(optimjs == null){ // this is necessary for automated testing of example in node.js
    var optimjs = require('../src/optimization') // this is run in node.js only
}

// define some objective function that is to be minimized
// this is a convex function with the unique global optimum at [1.0, 0.0, -2.0]
var objective = function(x){
    return (x[0]-1.0)*(x[0]-1.0) + (x[1]+1.0)*(x[1]+1.0)
}

// create example space 
var dims = [
    new optimjs.Real(-2.0, 2.0),
    new optimjs.Real(-2.0, 2.0),
]

function example_bb_random_optimization(){
    /* There are two ways to run the optimization:
    * 1. Using a convenience *_minimize function. This is the 
    * easiest way to run the optimization for standard tasks.
    * 2. Manually using optimization object. This gives you most 
    * flexibility.
    * Both methods are shown below.
    */

    // minimization using convenience function. As simple as that!
    var result = optimjs.dummy_minimize(objective, dims, n_calls=256)
    
    // minimizing input to the function found thus far
    var x1 = result.best_x

    // best objective found
    var y1 = result.best_y

    // Create optimizer instance. A necessary input is the definition of space.
    var optimizer = new optimjs.RandomOptimizer(dims)

    // optimization loop specified manually. The optimization runs for 256 iterations.
    for(var iter=0; iter<256; iter++){
        // "ask" for next point to evaluate
        var x = optimizer.ask();

        // evaluate the point returned by the algorithm
        var y = objective(x)

        // "tell" the algorithm which inputs were evaluated (x) and what were the objectives (y)
        optimizer.tell([x], [y])
    }

    // similar as for dummy_minimize, get the solution 
    var x2 = optimizer.best_x
    var y2 = optimizer.best_y

    // returned values are automatically tested for consistency in our internal
    // unit testing system.
    return [[x1, y1], [x2, y2]]
}

// Below code is necessary for testing in node.js only. It has nothing to do with the examples above.
exports = typeof module != 'undefined' && module.exports;  // add exports to module.exports if in node.js

// record the 
exports.example_bb_random_optimization = example_bb_random_optimization
