/**
 * Dimension of real type. 
 * @constructor
 * @param {Number} low Lower bound of the values. Lower bound is inclusive.
 * @param {Number} high Upper inclusive bound of the values of dimension. 
 */ 
function Real(low, high){
    this.low = low
    this.high = high

    /**
     * Generate random uniformly distributed scalar sample from dimension space.
     * @returns {Number} Sample value.
     */
    this.random_sample = function(){
        /* Returns a uniformly sampled value from the space */
        return Math.random()*(this.high - this.low) + this.low
    }
}
module.exports.Real = Real;

/**
 * An object that represents a search space for an optimization problem. 
 * Contains some helper methods, such as methods for automated sampling
 * of values from the space.
 * @constructor
 * @param {Number} dimensions An array of dimension descriptors that are 
 * used to specify search space.
 */
function Space(dimensions){
    /*Stores a set of dimensions and provides convenience funcs */
    this.dims = dimensions;

    /**
     * Sample n points from the search space at random. Sampling is done
     * using functionality provided by the dimension classes themselves.
     * @param {Integer} n Number of points to sample.
     * @returns {Arrray} An array of vectors containing sampled values.
     */
    this.random_samples = function(n){
        /*Sample n points from space at random.*/
        var X = []
        for(var i = 0; i < n; i++){
            var x = []
            for(var dim of this.dims){
                x.push(dim.random_sample())
            }
            X.push(x)
        }
        return X
    }
}
module.exports.Space = Space;

/**
 * A convenience function for conversion of Array of dimensions into a
 * single {@link Space} instance.
 * @param {Object} space_object Either an array of dimension objects, or
 * a {@link Space} instance.
 * @returns {Space} an instance of {@link Space} created out of the provided
 * objects.
 */
module.exports.to_space = function(space_object){
    // check if list of dimensions
    if(space_object instanceof Array){
        return new module.exports.Space(space_object)
    }

    if(space_object instanceof module.exports.Space){
        return space_object
    }
    
    throw 'Unknown space definition'
}

/**
 * A random optimization function. Sometimes competitive in practice
 * for hyperparameter tuning for instance. 
 * @constructor
 * @param {Object} space An array of dimension descriptors that are 
 * used to specify search space or an instance of {@link Space}.
 * @property {Array} X An array of arguments tried.
 * @property {Array} Y An array of function values observed. The 
 * order corresponds to the order in arguments array.
 * @property {Array} best_x An argument that results in minimal objective
 * function value.
 * @property {Number} best_y Minimal objective value observed.
 * @property {Space} space Optimization space over which the optimization is done.
 */
module.exports.RandomOptimizer = function(space){
    this.space = module.exports.to_space(space)
    this.X = []
    this.Y = []
    this.best_x = null
    this.best_y = null

    /**
     * Get the next point or array of points to evaluate.
     * @param {Number} n Specifies how many points should be provided by
     * the optimizer algorithm to try in parallel. If specified, an array
     * of points to evaluate is returned. If not, only a single point is 
     * returned verbatium.
     */
    this.ask = function(n=null){
        if(n == null){
            return this.space.random_samples(1)[0]
        }

        // return array of points
        return this.space.random_samples(n)
    }

    /**
     * Report back to the optimizer the points that were tried. Do not 
     * really need to do it for random sampling, but this is here for 
     * consistency with future more "intelligent" algorithms.
     * @param {Array} X Array of observed points.
     * @param {Array} Y Array of objective values corresponding to the 
     * points that were evaluated.
     */
    this.tell = function(X, Y){
        for(var i = 0; i < X.length; i++){
            if(this.best_y == null || Y[i] < this.best_y){
                this.best_y = Y[i]
                this.best_x = X[i]
            }
        }

        // record observations
        this.X = this.X.concat(X)
        this.Y = this.Y.concat(Y)

    }

}

/**
 * Minimize a function using a random algorithm.
 * While naive, such approach is often surprisingly competitive
 * for hyperparameter tuning purposes. Internally uses {@link RandomOptimizer}
 * class to perform optimization.
 * @param {function} fnc Function to be minimized.
 * @param {Array} dims An array of dimensions, that describe a search space for minimization,
 * or an instance of {@link Space} object.
 * @param {Number} [n_calls=64] Function evaluation budget. The function will be evaluated for
 * at most this number of times.
 * @return {RandomOptimizer} The optimizer instance, that contains information about found minimum and explored arguments.
*/
 function dummy_minimize (func, dims, n_calls=64){
    var opt = new module.exports.RandomOptimizer(dims);

    for(var iter=0; iter < n_calls; iter++){
        var x = opt.ask()
        var y = func(x)
        opt.tell([x], [y])
    }

    return opt
}
module.exports.dummy_minimize = dummy_minimize

/**
 * Minimize an unconstrained function using zero order Powell algorithm.
 * @param {function} fnc Function to be minimized. This function takes 
 * array of size N as an input, and returns a scalar value as output, 
 * which is to be minimized.
 * @param {Array} x0 An array of values of size N, which is an initialization
 *  to the minimization algorithm.
 * @return {Object} An object instance with two fields: argument, which 
 * denotes the best argument found thus far, and fncvalue, which is a
 * value of the function at the best found argument.
*/
module.exports.minimize_Powell = function (fnc, x0) {
    var eps = 1e-2;

    var convergence = false;
    var x = x0.slice(); // make copy of initialization
    var alpha = 0.001; // scaling factor

    var pfx = Math.exp(10);
    var fx = fnc(x);
    var pidx = 1;
    while (!convergence) {

        var indicies = shuffleIndiciesOf(x);
        convergence = true;

        // Perform update over all of the variables in random order
        for (var i = 0; i < indicies.length; i++) {

            x[indicies[i]] += 1e-6;
            var fxi = fnc(x);
            x[indicies[i]] -= 1e-6;
            var dx = (fxi - fx) / 1e-6;

            if (Math.abs(dx) > eps) {
                convergence = false;
            }

            x[indicies[i]] = x[indicies[i]] - alpha * dx;
            fx = fnc(x);

        }

        // a simple step size selection rule. Near x function acts linear 
        // (this is assumed at least) and thus very small values of alpha
        // should lead to (small) improvement. Increasing alpha would
        // yield better improvement up to certain alpha size.
        
        alpha = pfx > fx ? alpha * 1.1 : alpha * 0.7;
        pfx = fx;

        pidx--;
        if (pidx === 0) {
            pidx = 1;
        }

    }

    var solution = {};
    solution.argument = x;
    solution.fncvalue = fx;

    return solution;

};

/**
 * Minimize an unconstrained function using first order gradient descent algorithm.
 * @param {function} fnc Function to be minimized. This function takes 
 * array of size N as an input, and returns a scalar value as output, 
 * which is to be minimized.
 * @param {function} grd A gradient function of the objective.
 * @param {Array} x0 An array of values of size N, which is an initialization
 *  to the minimization algorithm.
 * @return {Object} An object instance with two fields: argument, which 
 * denotes the best argument found thus far, and fncvalue, which is a
 * value of the function at the best found argument.
*/
module.exports.minimize_GradientDescent = function (fnc, grd, x0) {
    // fnc: function which takes array of size N as an input
    // grd: gradient (array of size N) of function for some input
    // x0: array or real numbers of size N; 
    // serves as initialization of algorithm.

    // solution is a struct, with fields:
    // argument: solution argument
    // fncvalue: function value at found optimum
    var x = x0.slice();

    var convergence = false;
    var eps = 1e-3;
    var alpha = 0.01;

    var pfx = fnc(x);

    while (!convergence) {
        var g = grd(x);
        convergence = vect_max_abs_x_less_eps(g, eps);

        if (convergence) {
            break;
        }

        var repeat = true;

        // a simple step size selection rule. Near x function acts linear 
        // (this is assumed at least) and thus very small values of alpha
        // should lead to (small) improvement. Increasing alpha would
        // yield better improvement up to certain alpha size.
        
        while (repeat) {
            var xn = x.slice();
            vect_x_pluseq_ag(xn, -alpha, g); // perform step
            var fx = fnc(xn);

            repeat = pfx < fx;
            // this automatically selects step size 
            alpha = repeat ? alpha * 0.7 : alpha * 1.1;
        }

        x = xn;
        pfx = fx;

    }

    var solution = {};
    solution.argument = x;
    solution.fncvalue = fx;
    return solution;

};

/**
 * Minimize an unconstrained function using first order L-BFGS algorithm.
 * @param {function} fnc Function to be minimized. This function takes 
 * array of size N as an input, and returns a scalar value as output, 
 * which is to be minimized.
 * @param {function} grd A gradient function of the objective.
 * @param {Array} x0 An array of values of size N, which is an initialization
 *  to the minimization algorithm.
 * @return {Object} An object instance with two fields: argument, which 
 * denotes the best argument found thus far, and fncvalue, which is a
 * value of the function at the best found argument.
*/
module.exports.minimize_L_BFGS = function (fnc, grd, x0) {
    // fnc: function which takes array of size N as an input
    // grd: gradient (array of size N) of function for some input
    // x0: array or real numbers of size N; 
    // serves as initialization of algorithm.

    // solution is a struct, with fields:
    // argument: solution argument
    // fncvalue: function value at found optimum
    var x = x0.slice();

    var eps = 1e-5; // max abs value of gradient component for termination
    var alpha = 0.001; // initial step size
    var m = 5; // history size to keep for Hessian approximation

    var pfx = fnc(x);
    var s = []; // this is needed for lbfgs procedure
    var y = [];
    var ro = [];

    var g = grd(x);
    var direction = g.slice();
    var convergence = false;
    while (!convergence) {

        var xn = x.slice();
        vect_x_pluseq_ag(xn, alpha, direction); // perform step
        var fx = fnc(xn);
        alpha = pfx < fx ? alpha * 0.5 : alpha * 1.2; // magic!

        //  < ================= apply limited memory BFGS procedure ================= >
        var gn = grd(xn);

        if (vect_max_abs_x_less_eps(gn, eps)) {
            break;
        }

        var dx = vect_a_minus_b(xn, x);
        var dg = vect_a_minus_b(gn, g);

        s.unshift(dx);
        y.unshift(dg);
        var tmp = 1 / (dot(dx, dg));
        ro.unshift(tmp);

        if (s.length > m) {
            s.pop();
            y.pop();
            ro.pop();
        }

        var r = g.slice();
        var a = new Array(s.length);

        for (var i = 0; i < s.length; i++) {
            var pi = 1 / (dot(s[i], y[i]));
            a[i] = pi * dot(s[i], r);
            vect_x_pluseq_ag(r, -a[i], y[i]);
        }

        // perform Hessian scaling
        var scale = dot(dx, dg) / dot(dg, dg);
        for (var i = 0; i < r.length; i++) {
            r[i] = r[i] * scale;
        }

        for (var i = 0; i < s.length; i++) {
            var j = s.length - i - 1;
            var pj = 1 / (dot(s[j], y[j]));
            var beta = pj * dot(y[j], r);
            vect_x_pluseq_ag(r, (a[j] - beta), s[j]);
        }
        direction = r.slice();

        //  < ================= apply limited memory BFGS procedure ================= >
        
        for (var i = 0; i < direction.length; i++) {
            direction[i] = -direction[i];
        }

        pfx = fx;
        x = xn;
        g = gn;

    }

    var solution = {};
    solution.argument = x;
    solution.fncvalue = fx;
    return solution;

};

/*module.exports.numerical_gradient = function (fnc, x) {
    // can be used as for gradient check or its substitute. Gradient is approx. via forward difference
    var grad = x.slice();
    var fx = fnc(x);
    var h = 1e-6; // step size

    for (var i = 0; i < x.length; i++) {

        // approximation using simple forward difference
        x[i] += h;
        var fxi = fnc(x);
        x[i] -= h;

        grad[i] = (fxi - fx) / h;
    }
    return grad;
};*/

/**
 * Shuffles indicies of arrray.
 * @ignore
 * @param {Array} array Array to shuffle.
 */
function shuffleIndiciesOf (array) {
    var idx = [];
    for (var i = 0; i < array.length; i++) {
        idx.push(i);
    }
    for (var i = 0; i < array.length; i++) {
        var j = Math.floor(Math.random() * i);
        var tmp = idx[i];
        idx[i] = idx[j];
        idx[j] = tmp;
    }
    return idx;
};

/**
 * Computes dot product.
 * @ignore
 * @param {Array} a First vector argument.
 * @param {Array} b Second vector argument.
 */
function dot (a, b) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;

};

/**
 * Substracts vectors.
 * @ignore
 * @param {Array} a First vector argument.
 * @param {Array} b Second vector argument.
 */
function vect_a_minus_b (a, b) {
    var result = new Array(a.length);
    for (var i = 0; i < a.length; i++) {
        result[i] = a[i] - b[i];
    }
    return result;

};

/**
 * Fixed step size updating value of x.
 * @ignore
 * @param {Array} x First vector argument.
 * @param {Number} a Step size.
 * @param {Array} g Gradient.
 */
function vect_x_pluseq_ag (x, a, g) {
    for (var i = 0; i < x.length; i++) {
        x[i] = x[i] + a * g[i];
    }

    return x;

};

/**
 * Checks whether absolute values in a vector are greater than 
 * some threshold.
 * @ignore
 * @param {Array} x Vector that is checked.
 * @param {Number} eps Threshold.
 */
function vect_max_abs_x_less_eps (x, eps) {
    // this procedure is used for stopping criterion check
    for (var i = 0; i < x.length; i++) {
        if (Math.abs(x[i]) >= eps) {
            return false;
        }
    }
    return true;
};
