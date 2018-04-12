var expect = require('chai').expect;

var optimjs = require('../src/optimization')
var quad_examples = require('../examples/example_quadratic.js')

function round(v, d){
    /**
     * Rounds a value v to d decimal places, where v can be scalar or array.
     */

    if(v instanceof Array){
        var v_new = []
        for(var x of v){
            var x_round = Math.round(x * Math.pow(10, d)) * Math.pow(10, -d)
            v_new.push(x_round)
        }
        return v_new
    }

    return Math.round(v * Math.pow(10, d)) * Math.pow(10, -d)
}

function test_quadratic_example(eg){
    var solution = eg()

    // round here the solution, in order to avoid numerical issues
    var x = round(solution.argument, 2)
    var f = round(solution.fncvalue, 2)

    // check that the rounded result corresponds to the expected solution
    expect(x).to.deep.equal([1.0, -0.5, -2.0]);
    expect(f).to.deep.equal(0.0);
}

describe('Examples', function(){
    it('Powell method, quadratic optimization example', function(){
        test_quadratic_example(quad_examples.example_minimization_powell)
    })
    it('Gradient descent method, quadratic optimization example', function(){
        // run the powell quadratic function minimization example
        test_quadratic_example(quad_examples.example_minimization_gd)
    })
    it('L-BFGS method, quadratic optimization example', function(){
        // run the powell quadratic function minimization example
        test_quadratic_example(quad_examples.example_minimization_lbfgs)
    })
})