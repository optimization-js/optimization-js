function Real(low, high){
    this.low = low
    this.high = high

    this.random_sample = function(){
        /* Returns a uniformly sampled value from the space */
        return Math.random()*(this.high - this.low) + this.low
    }
}
module.exports.Real = Real;

function Space(dimensions){
    /*Stores a set of dimensions and provides convenience funcs */
    this.dims = dimensions;
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

module.exports.to_space = function(space_object){
    /*Converts object to Space instance. Object can be at
    least two options:
    1. object is instance of Space, which is then returned
    2. object is list of dimensions, which is then converted
    to instance of Space and returned.*/

    // check if list of dimensions
    if(space_object instanceof Array){
        return new module.exports.Space(space_object)
    }

    if(space_object instanceof module.exports.Space){
        return space_object
    }
    
    throw 'Unknown space definition'
}

module.exports.RandomOptimizer = function(space){
    /*Performs optimization simply by randomly sampling
    points from space.
    Often very competitive in practice.*/
    this.space = module.exports.to_space(space)
    this.X = []
    this.Y = []
    this.best_x = null
    this.best_y = null

    this.ask = function(n=null){
        /* Returns the next n points to try */
        // if n is not specified, return a single point verbatium
        if(n == null){
            return this.space.random_samples(1)[0]
        }

        // return array of points
        return this.space.random_samples(n)
    }

    this.tell = function(X, Y){
        /* Record new observed points. 
        Do not really need to do it for random sampling.*/
        
        for(var i = 0; i < X.length; i++){
            if(this.best_y == null || Y[i] < this.best_y){
                this.best_y = Y[i]
                this.best_x = X[i]
            }
        }

        // record observations
        this.X = this.X.concat(X)
        this.Y = this.Y.concat(Y)

        // create the optimization result object
    }

}

/**
 * Minimize a function using a random algorithm.
 * While naive, such approach is often surprisingly competitive
 * for hyperparameter tuning purposes.
 * @param {function} func Function to be minimized.
 * @param {Array} dims An array of dimensions, that describe a search space for minimization..
 * @param {Number} [n_calls=64] Function evaluation budget.
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

module.exports.minimize_Powell = function (fnc, x0) {
    // fnc: function which takes array of size N as an input
    // x0: array or real numbers of size N; 
    // serves as initialization of algorithm.

    // solution is a struct, with fields:
    // argument: solution argument
    // fncvalue: function value at optimum

    // maximum absolute gradient magnitude
    var eps = 1e-2;

    var convergence = false;
    var x = x0.slice(); // make copy of initialization
    var alpha = 0.001; // scaling factor

    var pfx = Math.exp(10);
    var fx = fnc(x);
    var pidx = 1;
    while (!convergence) {

        var indicies = module.exports.shuffleIndiciesOf(x);

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
        convergence = module.exports.vect_max_abs_x_less_eps(g, eps);

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
            module.exports.vect_x_pluseq_ag(xn, -alpha, g); // perform step
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
        module.exports.vect_x_pluseq_ag(xn, alpha, direction); // perform step
        var fx = fnc(xn);
        alpha = pfx < fx ? alpha * 0.5 : alpha * 1.2; // magic!

        //  < ================= apply limited memory BFGS procedure ================= >
        var gn = grd(xn);

        if (module.exports.vect_max_abs_x_less_eps(gn, eps)) {
            break;
        }

        var dx = module.exports.vect_a_minus_b(xn, x);
        var dg = module.exports.vect_a_minus_b(gn, g);

        s.unshift(dx);
        y.unshift(dg);
        var tmp = 1 / (module.exports.dot(dx, dg));
        ro.unshift(tmp);

        if (s.length > m) {
            s.pop();
            y.pop();
            ro.pop();
        }

        var r = g.slice();
        var a = new Array(s.length);

        for (var i = 0; i < s.length; i++) {
            var pi = 1 / (module.exports.dot(s[i], y[i]));
            a[i] = pi * module.exports.dot(s[i], r);
            module.exports.vect_x_pluseq_ag(r, -a[i], y[i]);
        }

        // perform Hessian scaling
        var scale = module.exports.dot(dx, dg) / module.exports.dot(dg, dg);
        for (var i = 0; i < r.length; i++) {
            r[i] = r[i] * scale;
        }

        for (var i = 0; i < s.length; i++) {
            var j = s.length - i - 1;
            var pj = 1 / (module.exports.dot(s[j], y[j]));
            var beta = pj * module.exports.dot(y[j], r);
            module.exports.vect_x_pluseq_ag(r, (a[j] - beta), s[j]);
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

module.exports.shuffleIndiciesOf = function (array) {
    // returns shuffled indicies of arrray
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

module.exports.dot = function (a, b) {
    // computes dot product
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;

};

module.exports.vect_a_minus_b = function (a, b) {
    // vector difference
    var result = new Array(a.length);
    for (var i = 0; i < a.length; i++) {
        result[i] = a[i] - b[i];
    }
    return result;

};

module.exports.vect_x_pluseq_ag = function (x, a, g) {
    // used for fixed step size updating value of x
    for (var i = 0; i < x.length; i++) {
        x[i] = x[i] + a * g[i];
    }

    return x;

};

module.exports.vect_max_abs_x_less_eps = function (x, eps) {
    // this procedure is used for stopping criterion check
    for (var i = 0; i < x.length; i++) {
        if (Math.abs(x[i]) >= eps) {
            return false;
        }
    }
    return true;
};