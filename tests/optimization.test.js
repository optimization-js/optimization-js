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


var bb_examples = require('../examples/example_black_box.js')

describe('Ask and tell optimizers', function(){
    it('examples of quadratic minimization runs ok', function(){
        // minimum of below: x = [1.0, -1.0]
        var solution = bb_examples.example_bb_optimization();

        // solution using *_minimize method 
        var x = solution[0][0]
        var y = solution[0][1]

        expect(x[0]).to.be.greaterThan(0.5).lessThan(1.5)
        expect(x[1]).to.be.greaterThan(-1.5).lessThan(-0.5)
        expect(y).to.be.greaterThan(-0.3).lessThan(0.3)

        // solution using the ask and tell object
        var x = solution[1][0]
        var y = solution[1][1]

        expect(x[0]).to.be.greaterThan(0.5).lessThan(1.5)
        expect(x[1]).to.be.greaterThan(-1.5).lessThan(-0.5)
        expect(y).to.be.greaterThan(-0.3).lessThan(0.3)
    })
    it('example of mixed optimization runs ok', function(){
        var solution = bb_examples.example_bb_mixed_minimization();
        var x = solution.best_x

        expect(x[0]).to.be.greaterThan(-3.1).lessThan(-2.9)
        expect(x[1]).to.be.greaterThan(62).lessThan(66)
        expect(x[2]).to.be.equal('relu')
    })
    it('allows to sample n points at a time', function(){
        var optimizer = optimjs.RandomOptimizer([
            optimjs.Real(-1.0, 1.0)
        ])

        var X = optimizer.ask(2)
        expect(X.length).to.be.equal(2)
    })
})

describe('Space', function(){
    it('can be created from list of dims', function(){
        var dims  = [
            optimjs.Real(-1.0, 1.0),
            optimjs.Real(-1.0, 1.0),
        ]

        // create from list of dims
        var space = optimjs.to_space(dims)

        // ensure that the space does not raise an exceptions
        space = optimjs.to_space(space)

        expect(function(){
            optimjs.to_space('A')
        }).to.throw(
            'Unknown space definition'
        )
    })
    it('should work with integer dimensions', function(){
        // test creation of the Integer dimension
        var dim = optimjs.Integer(0, 3)
        
        // test the values returned by the integer value
        var r = {}

        // remember a bunch of unique values returned by the sampling
        for(var i = 0; i < 100; i++){
            var sample = dim.random_sample()
            r[sample] = 1
        }

        // confirm that the whole range is sampled, no more, no less
        expect(r).to.deep.equal({0:1, 1:1, 2:1, 3:1});
    })
    it('should work with categorical dimensions', function(){
        // test creation of the Integer dimension
        var dim = optimjs.Categorical(['a', 1, 2.0, 'zazz', true])
        
        // test the values returned by the integer value
        var r = {}

        // remember a bunch of unique values returned by the sampling
        for(var i = 0; i < 100; i++){
            var sample = dim.random_sample()
            r[sample] = 1
        }

        // confirm that the whole range is sampled, no more, no less
        expect(r).to.deep.equal({'a':1, 1:1, 2.0:1, 'zazz': 1, true:1});
    })
})