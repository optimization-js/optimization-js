var optimjs = (function (exports) {

    // export public members
    exports = exports || {};

    exports.minimize_Powell = function (fnc, x0) {
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

            var indicies = optimjs.shuffleIndiciesOf(x);

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
                console.log(fx);
            }

        }

        var solution = {};
        solution.argument = x;
        solution.fncvalue = fx;

        return solution;

    };

    exports.minimize_GradientDescent = function (fnc, grd, x0) {
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
            convergence = optimjs.vect_max_abs_x_less_eps(g, eps);

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
                optimjs.vect_x_pluseq_ag(xn, -alpha, g); // perform step
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

    exports.minimize_L_BFGS = function (fnc, grd, x0) {
        // fnc: function which takes array of size N as an input
        // grd: gradient (array of size N) of function for some input
        // x0: array or real numbers of size N; 
        // serves as initialization of algorithm.

        // solution is a struct, with fields:
        // argument: solution argument
        // fncvalue: function value at found optimum
        var x = x0.slice();

        var eps = 1e-3; // max abs value of gradient component for termination
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
            optimjs.vect_x_pluseq_ag(xn, alpha, direction); // perform step
            var fx = fnc(xn);
            alpha = pfx < fx ? alpha * 0.5 : alpha * 1.2; // magic!

            //  < ================= apply limited memory BFGS procedure ================= >
            var gn = grd(xn);

            if (optimjs.vect_max_abs_x_less_eps(gn, eps)) {
                break;
            }

            var dx = optimjs.vect_a_minus_b(xn, x);
            var dg = optimjs.vect_a_minus_b(gn, g);

            s.unshift(dx);
            y.unshift(dg);
            var tmp = 1 / (optimjs.dot(dx, dg));
            ro.unshift(tmp);

            if (s.length > m) {
                s.pop();
                y.pop();
                ro.pop();
            }

            var r = g.slice();
            var a = new Array(s.length);

            for (var i = 0; i < s.length; i++) {
                var pi = 1 / (optimjs.dot(s[i], y[i]));
                a[i] = pi * optimjs.dot(s[i], r);
                optimjs.vect_x_pluseq_ag(r, -a[i], y[i]);
            }

            // perform Hessian scaling
            var scale = optimjs.dot(dx, dg) / optimjs.dot(dg, dg);
            for (var i = 0; i < r.length; i++) {
                r[i] = r[i] * scale;
            }

            for (var i = 0; i < s.length; i++) {
                var j = s.length - i - 1;
                var pj = 1 / (optimjs.dot(s[j], y[j]));
                var beta = pj * optimjs.dot(y[j], r);
                optimjs.vect_x_pluseq_ag(r, (a[j] - beta), s[j]);
            }
            direction = r.slice();

            for (var i = 0; i < direction.length; i++) {
                if (isNaN(direction[i])) {
                    convergence = true; // something went wrong. Stop now
                }
            }

            //  < ================= apply limited memory BFGS procedure ================= >
            
            for (var i = 0; i < direction.length; i++) {
                direction[i] = -direction[i];
            }

            pfx = fx;
            x = xn;
            g = gn;
            
            console.log("fv = " + fx);

        }

        var solution = {};
        solution.argument = x;
        solution.fncvalue = fx;
        return solution;

    };

    exports.minimize_SGD = function (I, fnc, grd, W0){
        // This routine assumes that objective can be written as 
        //          f(W) = \sum_{i \in [n]} g(W)
        // and using this poperty gradient is updated for every separate i, which results in speedups.
        //
        // inputs:
        // I: array of indicies of all of points in the dataset (e.g. 1 ... 1000)
        // fnc: function which takes as input parameter W and index of point with index i
        // grd: gradient over parameter W of fnc for point with index i
        // W0: initial value of parameters of fnc

        // solution is a struct, with fields:
        // argument: solution argument
        // fncvalue: function value at optimum
        
        var splitp = Math.floor(I.length*0.7); // 70 % is used for training , rest for validation
        
        var Iv = I.slice(splitp+1);
        var I = I.slice(0, splitp);
        
        var W = W0.slice();
        
        var alpha = 0.00001; // initial alpha guess
        var checks = 5; // validation checks until stopping
        var fmin = Math.exp(30); // initial minimum value (something big)
        var maxiternum = 70; // maximum number of iterations
        
        var Wbest = W.slice();
        var idx = 0;
        
        while(checks > 0){
            idx ++;
            // perform gradient update
            for (var i = 0; i < I.length; i++) {
                var gr = grd(W,I[i]);
                optimjs.vect_x_pluseq_ag(W, -alpha, gr);
            }
            
            var floc = 0;
            
            // perform cross - validation
            for (var i = 0; i < Iv.length; i++) {
                var fv = fnc(W,Iv[i]);
                floc += fv;
            }
            
            if (floc < fmin) {
                fmin = floc;
                Wbest = W.slice();
                alpha *= 1.1;
                checks = 10;
            }
            else
            {
                checks -= 1;
                alpha *= 0.5;
            }
            
            // log the current state
            console.log("epoch with fv = " + fmin + " alpha= " + alpha);
            if (idx > maxiternum) {
                break;
            }
        }
        
        var solution = {};
        solution.argument = Wbest.slice();
        solution.fncvalue = fmin;
        return solution;
        
    };

    exports.numerical_gradient = function (fnc, x) {
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
    };

    // some vector operations used in all of the optimization procedures above


    exports.shuffleIndiciesOf = function (array) {
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

    exports.dot = function (a, b) {
        // computes dot product
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            result += a[i] * b[i];
        }
        return result;

    };

    exports.vect_x_times_c = function (x, c) {
        // vector times constant
        var r = x.slice();
        for (var i = 0; i < x.length; i++) {
            r[i]  = r[i] * c;
        }
        return r;

    };

    exports.vect_a_minus_b = function (a, b) {
        // vector difference
        var result = new Array(a.length);
        for (var i = 0; i < a.length; i++) {
            result[i] = a[i] - b[i];
        }
        return result;

    };

    exports.vect_x_pluseq_ag = function (x, a, g) {
        // used for fixed step size updating value of x
        for (var i = 0; i < x.length; i++) {
            x[i] = x[i] + a * g[i];
        }

        return x;

    };

    exports.vect_max_abs_x_less_eps = function (x, eps) {
        // this procedure is used for stopping criterion check
        for (var i = 0; i < x.length; i++) {
            if (Math.abs(x[i]) >= eps) {
                return false;
            }
        }
        return true;
    };

    return exports;

})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js
